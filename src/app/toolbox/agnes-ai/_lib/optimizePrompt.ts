import { chatCompletion } from './api/client';
import { DEFAULT_ROUTE_MODELS } from './models';

const IMAGE_PROMPT_SYSTEM_BASE = `你是专业的 AI 图像生成提示词工程师。请根据用户输入，输出一条大幅增强后的图像生成 Prompt。

核心原则：
- 保留用户核心意图与关键元素，在此基础上主动扩展与丰富
- 用户描述简略时，合理推断并补充细节，不要只做同义改写或轻微润色
- 输出应明显比原文更具体、更完整，信息密度更高

必须补充的维度（按场景选取，能写则写）：
- 主体：外观特征、姿态动作、表情神态、服装配饰、数量与位置关系
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

export async function optimizeImagePrompt(
  userPrompt: string,
  options?: { onDelta?: (content: string) => void },
) {
  const trimmed = userPrompt.trim();
  const language = detectPromptLanguage(trimmed);

  const result = await chatCompletion({
    model: DEFAULT_ROUTE_MODELS.text,
    messages: [
      { role: 'system', content: buildImagePromptSystem(language) },
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
