import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// 当前文件所在目录（用于构造相对路径）
const currentDir = dirname(fileURLToPath(import.meta.url));

// 读取简历知识文件（带多路径与兜底逻辑）
const readKnowledge = () => {
  // Netlify 本地调试和源码目录的落盘路径不一致，所以这里准备多套候选路径。
  const candidates = [
    // 1) 直接从 functions/utils 相对路径回退到 functions/data
    join(currentDir, "../data/resume-knowledge.json"),
    // 2) 从项目根目录出发的源码路径（本地直接运行时常见）
    resolve(process.cwd(), "functions/data/resume-knowledge.json"),
    // 3) Netlify dev 打包后函数目录（.netlify/functions-serve）
    resolve(process.cwd(), ".netlify/functions-serve/data/resume-knowledge.json"),
  ];

  // 依次尝试读取，命中一个即可返回。
  for (const filePath of candidates) {
    // 文件不存在就继续尝试下一个路径。
    if (!existsSync(filePath)) continue;
    try {
      // 命中后读取并解析 JSON。
      return JSON.parse(readFileSync(filePath, "utf-8"));
    } catch (error) {
      // 文件存在但 JSON 格式异常时继续尝试下一个路径，避免服务直接崩溃。
      console.warn("[resume-rag] Failed to parse knowledge file:", filePath, error);
    }
  }

  // 最终兜底：即使知识文件丢失，也保证函数可运行（只是不具备检索能力）。
  console.warn("[resume-rag] resume-knowledge.json not found, using fallback profile.");
  return {
    // profile 兜底字段：让 system prompt 至少有基础人设信息。
    profile: {
      name: "廖声荣",
      englishName: "Mark",
      education: "西南科技大学，本科",
      experienceYears: "5年前端开发经验",
      jobTarget: "高级前端开发",
    },
    // chunks 为空表示“无可检索知识片段”。
    chunks: [],
  };
};

// 全局知识数据（模块加载时读取一次，减少重复 I/O）
const rawKnowledge = readKnowledge();

// 常见虚词/停用词：用于减少无意义词对检索分数的干扰。
const STOP_WORDS = new Set([
  "的",
  "了",
  "和",
  "是",
  "吗",
  "呢",
  "啊",
  "我",
  "你",
  "他",
  "她",
  "它",
  "在",
  "对",
  "与",
  "及",
  "并",
  "或",
  "一个",
  "一下",
  "这个",
  "那个",
  "什么",
  "怎么",
  "可以",
  "请问",
  "介绍",
  "说说",
  "一下子",
]);

// 文本归一化：统一小写 + 合并空白 + 去首尾空格。
const normalizeText = (value = "") => value.toLowerCase().replace(/\s+/g, " ").trim();

// 从 chunk 的 title/tags 中提前提取词典，用于增强 query 匹配召回率。
const KEYWORD_DICTIONARY = Array.from(
  new Set(
    // 从每个 chunk 里抽出标题和标签作为候选关键词。
    (rawKnowledge.chunks || [])
      .flatMap((chunk) => [chunk.title || "", ...(chunk.tags || [])])
      // 先拼成长字符串，统一做分隔切词。
      .join(" ")
      // 按中英文常见分隔符切分。
      .split(/[、,，\/&\s()+-]+/g)
      // 统一格式，避免大小写和空白影响命中。
      .map((item) => normalizeText(item))
      // 去掉太短的噪音词。
      .filter((item) => item.length >= 2)
  )
);

// 把用户问题拆成可用于检索的 token 集合。
const tokenize = (query = "") => {
  // 统一清洗标点，避免“项目？”“项目，”这类变体影响命中。
  const cleaned = normalizeText(query)
    .replace(/[，。！？；：、“”‘’（）()【】\[\],.!?;:/\\\-]/g, " ")
    .trim();
  // 按空白拆分基础片段。
  const segments = cleaned.split(/\s+/).filter(Boolean);
  // Set 自动去重，避免重复 token 重复加分。
  const tokens = new Set();

  // 遍历每个基础片段并提取中英 token。
  for (const segment of segments) {
    // 额外防御：空字符串直接跳过。
    if (!segment) continue;
    // 片段本身不是停用词且长度足够时，直接收录。
    if (!STOP_WORDS.has(segment) && segment.length > 1) {
      tokens.add(segment);
    }

    // 中文词块（长度>=2）直接保留，适配中文检索。
    const chineseParts = segment.match(/[\u4e00-\u9fa5]{2,}/g) ?? [];
    chineseParts.forEach((part) => {
      // 中文词块同样过滤停用词。
      if (!STOP_WORDS.has(part)) tokens.add(part);
    });

    // 英文/技术词保留大小写无关形式，如 nextjs、graphql、bff。
    const englishParts = segment.match(/[a-z0-9+#.]{2,}/gi) ?? [];
    englishParts.forEach((part) => {
      // 英文统一转小写，提升命中稳定性。
      tokens.add(part.toLowerCase());
    });
  }

  // 若 query 中包含知识库关键词，强制加入 token，提升精确召回。
  for (const keyword of KEYWORD_DICTIONARY) {
    // 例如 query 中出现 “腾讯SSV”，就把完整关键词塞进 token。
    if (cleaned.includes(keyword)) {
      tokens.add(keyword);
    }
  }

  // 限制 token 数量，避免 query 太长导致性能抖动。
  return Array.from(tokens).slice(0, 20);
};

// 意图词扩展：根据问法补充“语义相关词”。
const expandIntentTokens = (query = "") => {
  // 意图词扩展：把“问法”映射成更稳定的检索词，降低口语化提问带来的偏差。
  const lowered = normalizeText(query);
  // 额外补充词集合（最终会并入 token）
  const extra = [];

  // 工作相关问题 -> 注入工作领域词。
  if (/(工作|公司|任职|经历)/.test(lowered)) {
    extra.push("工作", "公司", "任职", "经历");
  }
  // 项目相关问题 -> 注入项目领域词。
  if (/(项目|案例|做过)/.test(lowered)) {
    extra.push("项目", "实践", "案例");
  }
  // 技能相关问题 -> 注入技能领域词。
  if (/(技能|技术栈|擅长|框架)/.test(lowered)) {
    extra.push("技能", "技术", "框架", "前端");
  }
  // 教育相关问题 -> 注入教育领域词。
  if (/(教育|学历|学校|本科|大专)/.test(lowered)) {
    extra.push("教育", "学历", "学校", "本科", "大专");
  }
  // 后端相关问题 -> 注入后端/BFF词，帮助命中相关项目片段。
  if (/(后端|服务端|node|nestjs|bff)/.test(lowered)) {
    extra.push("后端", "服务端", "nestjs", "bff");
  }

  // 返回扩展词列表。
  return extra;
};

// 识别 query 的高层意图（用于 section 级加权）
const detectIntent = (query = "") => {
  // 仅用于 section 级轻微加权，不直接决定最终结果。
  const lowered = normalizeText(query);
  return {
    // 是否偏向工作经历问题
    work: /(工作|公司|任职|经历)/.test(lowered),
    // 是否偏向项目问题
    projects: /(项目|案例|做过)/.test(lowered),
    // 是否偏向技能问题
    skills: /(技能|技术栈|擅长|框架)/.test(lowered),
    // 是否偏向教育背景问题
    education: /(教育|学历|学校|本科|大专)/.test(lowered),
  };
};

// 统计 token 在文本中出现次数（用于按命中次数加分）
const countIncludes = (text, token) => {
  // 任一为空都不可能命中。
  if (!text || !token) return 0;
  // 命中计数器
  let hits = 0;
  // 初次查找位置
  let idx = text.indexOf(token);
  // 循环向后查找，直到没有匹配。
  while (idx !== -1) {
    // 命中一次计数 +1
    hits += 1;
    // 从当前 token 末尾继续找下一个。
    idx = text.indexOf(token, idx + token.length);
  }
  // 返回总命中次数。
  return hits;
};

// 把 chunk 关键字段拼成统一搜索文本。
const buildSearchText = (chunk) =>
  normalizeText(`${chunk.title || ""} ${(chunk.tags || []).join(" ")} ${chunk.text || ""}`);

// 对单个 chunk 打分：分数越高，相关性越强。
const scoreChunk = (chunk, queryText, tokens, intent) => {
  // 分开计算 title/tag/body，便于给不同字段不同权重。
  const titleText = normalizeText(chunk.title || "");
  const tagText = normalizeText((chunk.tags || []).join(" "));
  const bodyText = normalizeText(chunk.text || "");
  // fullText 用于“整句命中”判断。
  const fullText = buildSearchText(chunk);

  // 当前 chunk 总分
  let score = 0;
  // 仅统计由 token 带来的命中分（用于后续加权判断）
  let matched = 0;

  // 如果“整句 query”直接是子串，给明显加分。
  if (queryText && fullText.includes(queryText)) {
    // 完整 query 命中，给一次明显加分（适合短问句）。
    score += 8;
  }

  // 遍历 token，对不同字段按权重加分。
  for (const token of tokens) {
    // title 命中次数
    const titleHits = countIncludes(titleText, token);
    // tag 命中次数
    const tagHits = countIncludes(tagText, token);
    // body 命中次数
    const bodyHits = countIncludes(bodyText, token);
    // 字段权重：title*3 + tag*2 + body*1
    const tokenScore = titleHits * 3 + tagHits * 2 + bodyHits;
    // 累加到总分
    score += tokenScore;
    // 记录 token 命中分（不含整句命中分）
    matched += tokenScore;
  }

  // 只在命中时叠加先验，避免无关结果挤占 TopK
  if (matched > 0 && (chunk.section === "skills" || chunk.section === "projects")) {
    // skills/projects 在当前场景中问得更频繁，给轻微偏置。
    score += 0.4;
  }

  // 根据用户问题意图对对应 section 做轻量加分。
  if (intent.work && chunk.section === "work") score += 2;
  if (intent.projects && chunk.section === "projects") score += 2;
  if (intent.skills && chunk.section === "skills") score += 2;
  if (intent.education && chunk.section === "education") score += 2;

  // 轻微长度惩罚，避免超长块在同分下占优
  if (matched > 0 || (queryText && fullText.includes(queryText))) {
    // 最大惩罚 0.8，避免惩罚过重。
    score -= Math.min(bodyText.length / 600, 0.8);
  }

  // 返回 chunk 最终分数。
  return score;
};

// 把 chunk 格式化成可直接注入 prompt 的条目文本。
const formatChunk = (chunk) =>
  // 按提示词可读格式输出，直接给模型作为“检索证据片段”。
  `- [${chunk.section}] ${chunk.title}\n  ${chunk.text}\n  标签: ${(chunk.tags || []).join("、")}`;

// 对外能力一：给定问题，返回 TopK chunk。
export const retrieveResumeChunks = (userQuery, topK = 4) => {
  // 预处理 query（归一化字符串）
  const queryText = normalizeText(userQuery);
  // token + 意图扩展词合并去重，兼顾“精确词”与“语义词”。
  const tokens = Array.from(new Set([...tokenize(userQuery), ...expandIntentTokens(userQuery)]));
  // 提取高层意图标签
  const intent = detectIntent(userQuery);

  // 对每个 chunk 打分并保留 score>0 的候选项。
  const scored = (rawKnowledge.chunks || [])
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, queryText, tokens, intent) }))
    .filter((item) => item.score > 0)
    // 按分数降序取 TopK，作为最终检索结果。
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // 只返回 chunk 本身，不暴露 score（保持对外接口简洁）。
  return scored.map((item) => item.chunk);
};

// 对外能力二：把检索结果拼成 system prompt 上下文文本。
export const buildResumeContext = (userQuery, topK = 4) => {
  // 该函数是对外主入口：把检索结果拼成 system prompt 可用文本。
  const chunks = retrieveResumeChunks(userQuery, topK);

  // 没检索到时返回“保守回答提示”，防止模型无依据胡编。
  if (chunks.length === 0) {
    return "未检索到可直接支撑该问题的简历片段。请基于已知人设给出保守回答，并主动向用户澄清具体方向。";
  }

  // 有命中时：先给基础画像，再给 TopK 证据片段列表。
  return `候选人基础信息：${rawKnowledge.profile.name}（${rawKnowledge.profile.englishName}），${rawKnowledge.profile.experienceYears}，${rawKnowledge.profile.education}。\n以下是与当前问题最相关的简历片段：\n${chunks
    .map(formatChunk)
    .join("\n")}`;
};

