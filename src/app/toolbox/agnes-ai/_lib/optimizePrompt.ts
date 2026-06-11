import { chatCompletion } from './api/client';
import { DEFAULT_ROUTE_MODELS } from './models';

const CHINESE_FACE_RULE = `人物面孔硬性要求（涉及人物时必须遵守，优先级最高）：
- 人物必须是中国面孔 / 东亚面孔，符合现代中国审美，禁止生成欧美脸、西方面孔或明显混血西化五官
- 必须明确写出面部特征：自然东亚面部比例、中国五官（如杏眼/内双/丹凤眼、柔和或立体的东亚鼻型、东亚唇形与眉形）
- 禁止使用的描述：欧美白人、拉丁裔、黑人、混血模特、深邃欧式眼窝、高鼻梁欧美风、好莱坞明星脸、洋人面孔
- 若用户未指定 ethnicity，默认人物为中国人；若用户已写「中国/国漫/国产」等，优化时须保留并强化，不得弱化为泛亚洲或西方脸
- 写实风格加「中国年轻女性/男性、自然东亚五官」；国漫/二次元风格加「国漫脸型、东亚动漫面部比例、国产番剧人设」`;

const IMAGE_PROMPT_SYSTEM_BASE = `你是专业的 AI 图像生成提示词工程师。请根据用户输入，输出一条大幅增强后的图像生成 Prompt。

${CHINESE_FACE_RULE}

核心原则：
- 保留用户核心意图与关键元素，在此基础上主动扩展与丰富
- 用户描述简略时，合理推断并补充细节，不要只做同义改写或轻微润色
- 输出应明显比原文更具体、更完整，信息密度更高

必须补充的维度（按场景选取，能写则写）：
- 主体：外观特征、姿态动作、表情神态、服装配饰、数量与位置关系；若主体是人物，首要补充中国面孔与东亚五官细节
- 场景：环境背景、空间层次、前景/中景/远景、天气与时间
- 构图：视角（俯视/仰视/平视/特写/全景）、景别、主体占比、视觉引导
- 光影：光源方向、软硬光、明暗对比、高光与阴影、环境光色温
- 色彩：主色调、辅助色、饱和度、色彩对比或和谐关系
- 风格：艺术流派、渲染方式（写实/插画/3D/水彩等）、参考质感
- 材质：表面纹理、反光/哑光、颗粒感、细节精度
- 氛围：情绪基调、叙事感、电影感或商业感等整体气质

输出要求：
- 用连贯的自然语言描述，各维度自然融合，避免机械罗列标签
- 篇幅应充实，通常不少于原文 2 倍；简短输入可扩展至 150–300 字（英文约 80–180 词）
- 适合直接用于图像生成 API
- 只输出优化后的 Prompt 纯文本，不要 markdown、不要解释、不要引号包裹`;

const VIDEO_PROMPT_SYSTEM_BASE = `你是专业的 AI 视频生成提示词工程师。请根据用户输入，输出一条大幅增强后的视频生成 Prompt。

${CHINESE_FACE_RULE}

核心原则：
- 保留用户核心意图与关键元素，在此基础上主动扩展与丰富
- 视频与静态图不同：必须清晰描述「主体如何运动、镜头如何移动、画面如何随时间演变」
- 用户描述简略时，合理推断并补充细节，不要只做同义改写或轻微润色

必须补充的维度（按场景选取，能写则写）：
- 主体运动：具体动作、运动方向与轨迹、速度节奏（慢镜头/正常/快切感）、起始与结束姿态；若主体是人物，须同时保持中国面孔与东亚五官描述不被冲掉
- 镜头语言：推/拉/摇/移/跟拍/环绕/升降/固定机位，景别是否变化（全景→中景→特写等）
- 时间叙事：适合短视频片段的开场→发展→收束，动作连贯、避免突兀跳变
- 场景：环境背景、空间层次、天气与时间推移
- 光影与色彩：光源变化、色温、主色调、明暗过渡
- 风格：写实/国漫/电影感/纪录片等整体质感
- 氛围：情绪基调、音乐感联想（仅描述画面，不写音效指令）

输出要求：
- 用连贯的自然语言描述，各维度自然融合，避免机械罗列标签
- 篇幅应充实，通常不少于原文 2 倍；简短输入可扩展至 180–400 字
- 适合直接用于文生视频 / 图生视频 API
- 只输出优化后的 Prompt 纯文本，不要 markdown、不要解释、不要引号包裹`;

function detectPromptLanguage(text: string): 'zh' | 'en' {
  const chinese = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g) || []).length;
  const latin = (text.match(/[a-zA-Z]/g) || []).length;
  if (chinese === 0 && latin === 0) return 'zh';
  return chinese >= latin ? 'zh' : 'en';
}

function buildImagePromptSystem(language: 'zh' | 'en') {
  const langRule = language === 'zh'
    ? '- 必须使用中文输出，与用户输入语言一致，禁止翻译成英文'
    : '- Must output in English only, matching the user input language; do not translate to Chinese';
  return `${IMAGE_PROMPT_SYSTEM_BASE}\n${langRule}`;
}

function buildVideoPromptSystem(language: 'zh' | 'en') {
  const langRule = language === 'zh'
    ? '- 必须使用中文输出，与用户输入语言一致，禁止翻译成英文'
    : '- Must output in English only, matching the user input language; do not translate to Chinese';
  return `${VIDEO_PROMPT_SYSTEM_BASE}\n${langRule}`;
}

function cleanOptimizedPrompt(raw: string) {
  let text = (raw || '').trim();
  const fenced = text.match(/```(?:\w+)?\s*([\s\S]*?)```/);
  if (fenced) text = fenced[1].trim();
  if (
    (text.startsWith('"') && text.endsWith('"'))
    || (text.startsWith("'") && text.endsWith("'"))
    || (text.startsWith('「') && text.endsWith('」'))
  ) {
    text = text.slice(1, -1).trim();
  }
  return text;
}

async function optimizePrompt(
  userPrompt: string,
  buildSystem: (language: 'zh' | 'en') => string,
  options?: { onDelta?: (content: string) => void },
) {
  const trimmed = userPrompt.trim();
  const language = detectPromptLanguage(trimmed);

  const result = await chatCompletion({
    model: DEFAULT_ROUTE_MODELS.text,
    messages: [
      { role: 'system', content: buildSystem(language) },
      { role: 'user', content: trimmed },
    ],
    stream: true,
    temperature: 0.85,
    maxTokens: 1536,
    onDelta: options?.onDelta
      ? ({ content }) => options.onDelta!(content)
      : undefined,
  });

  const optimized = cleanOptimizedPrompt(result.content);
  if (!optimized) throw new Error('未能获取优化后的 Prompt');
  return optimized;
}

export async function optimizeImagePrompt(
  userPrompt: string,
  options?: { onDelta?: (content: string) => void },
) {
  return optimizePrompt(userPrompt, buildImagePromptSystem, options);
}

export async function optimizeVideoPrompt(
  userPrompt: string,
  options?: { onDelta?: (content: string) => void },
) {
  return optimizePrompt(userPrompt, buildVideoPromptSystem, options);
}
