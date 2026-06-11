import { chatCompletion } from './api/client';
import { ALL_MODELS, DEFAULT_ROUTE_MODELS, ROUTER_MODEL_ID, type Model } from './models';

export type RouteTarget = 'text' | 'image' | 'video';

export type RouteResult = {
  target: RouteTarget;
  modelId: string;
  model?: Model;
  prompt: string;
  reply: string;
};

const MODEL_CATALOG = ALL_MODELS.map((m) => `- ${m.id}（${m.name}，${m.type}）`).join('\n');

const ROUTER_SYSTEM_PROMPT = `你是 Agnes Playground 的任务路由器。根据用户消息判断应调用的能力类型。

可用模型：
${MODEL_CATALOG}

路由规则：
- text：问答、聊天、分析、解释、写作、翻译、代码、理解图片内容等
- image：用户明确要求生成/绘制/设计图片、海报、插画等
- video：用户明确要求生成视频、动画、短片等

重要：
- 若 target 为 text，必须在 reply 字段给出完整回答，系统不会再次调用文本模型
- 若 target 为 image 或 video，reply 留空字符串，在 prompt 字段给出优化后的生成提示词
- modelId 必须从上述模型 id 中选择，且类型需与 target 一致

只输出 JSON，不要 markdown，格式：
{"target":"text|image|video","modelId":"模型id","prompt":"生成提示词","reply":"text时的完整回复"}`;

export function parseRouterResponse(raw: string): RouteResult {
  const text = (raw || '').trim();
  if (!text) throw new Error('路由器未返回内容');

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenced ? fenced[1].trim() : text;

  try {
    const parsed = JSON.parse(jsonText) as {
      target?: string;
      modelId?: string;
      prompt?: string;
      reply?: string;
    };
    const target = parsed.target;
    if (target !== 'text' && target !== 'image' && target !== 'video') {
      throw new Error('无效的路由目标');
    }

    const modelId = parsed.modelId || DEFAULT_ROUTE_MODELS[target];
    const model = ALL_MODELS.find((m) => m.id === modelId);
    if (!model || model.type !== target) {
      return {
        target,
        modelId: DEFAULT_ROUTE_MODELS[target],
        model: ALL_MODELS.find((m) => m.id === DEFAULT_ROUTE_MODELS[target]),
        prompt: parsed.prompt || '',
        reply: parsed.reply || '',
      };
    }

    return {
      target,
      modelId,
      model,
      prompt: parsed.prompt || '',
      reply: parsed.reply || '',
    };
  } catch {
    return {
      target: 'text',
      modelId: DEFAULT_ROUTE_MODELS.text,
      model: ALL_MODELS.find((m) => m.id === DEFAULT_ROUTE_MODELS.text),
      prompt: '',
      reply: text,
    };
  }
}

export async function routeUserMessage({
  text,
  attachment,
}: {
  text: string;
  attachment?: { url: string; type: 'video' | 'image' } | null;
}): Promise<RouteResult> {
  const userContent = attachment?.url
    ? [
        { type: 'text', text: text || '请根据附件内容回答或处理我的请求。' },
        { type: 'image_url', image_url: { url: attachment.url } },
      ]
    : text;

  const raw = await chatCompletion({
    model: ROUTER_MODEL_ID,
    messages: [
      { role: 'system', content: ROUTER_SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    stream: false,
    temperature: 0.2,
    maxTokens: 2048,
  });

  return parseRouterResponse(raw.content);
}
