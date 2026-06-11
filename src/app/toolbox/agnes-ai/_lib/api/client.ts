const API_KEY_STORAGE = 'agnes_api_key';
const FREE_USAGE_STORAGE = 'agnes_free_usage';
export const FREE_USAGE_LIMIT = 20;
const AGNES_API_HOST = 'https://apihub.agnes-ai.com';
const AGNES_API_BASE = `${AGNES_API_HOST}/v1`;
const AGNES_PROXY_BASE = '/api/agnes';

export function getUserApiKey() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

export function setUserApiKey(key: string) {
  if (typeof window === 'undefined') return;
  if (key.trim()) {
    localStorage.setItem(API_KEY_STORAGE, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE);
  }
  window.dispatchEvent(new Event('agnes-api-key-update'));
}

/** 未填写个人 Key 时，走服务端代理使用共享 Key */
export function isUsingSharedKey() {
  return !getUserApiKey();
}

function shouldUseProxy() {
  return isUsingSharedKey();
}

export function getFreeUsageCount() {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(FREE_USAGE_STORAGE);
  const n = parseInt(raw || '0', 10);
  return Number.isFinite(n) ? n : 0;
}

export function getFreeUsageRemaining() {
  if (!isUsingSharedKey()) return FREE_USAGE_LIMIT;
  return Math.max(0, FREE_USAGE_LIMIT - getFreeUsageCount());
}

function assertFreeQuota() {
  if (!isUsingSharedKey()) return;
  if (getFreeUsageCount() >= FREE_USAGE_LIMIT) {
    throw new Error(`免费额度已用完（${FREE_USAGE_LIMIT} 次）`);
  }
}

function recordFreeUsage() {
  if (!isUsingSharedKey()) return;
  const next = getFreeUsageCount() + 1;
  localStorage.setItem(FREE_USAGE_STORAGE, String(next));
  window.dispatchEvent(new Event('agnes-free-usage-update'));
}

function resolveUrl(path: string) {
  if (shouldUseProxy()) return `${AGNES_PROXY_BASE}${path}`;
  return `${AGNES_API_BASE}${path}`;
}

function resolveAgnesApiUrl(query: string) {
  if (shouldUseProxy()) return `${AGNES_PROXY_BASE}/agnesapi?${query}`;
  return `${AGNES_API_HOST}/agnesapi?${query}`;
}

function headers() {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!shouldUseProxy()) {
    const key = getUserApiKey();
    if (!key) throw new Error('请先设置 API Key');
    h.Authorization = `Bearer ${key}`;
  }
  return h;
}

type ChatMessageContent =
  | string
  | Array<{ type: string; text?: string; image_url?: { url: string } }>;

type ChatCompletionOptions = {
  model: string;
  messages: Array<{ role: string; content: ChatMessageContent }>;
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
  enableThinking?: boolean;
  onDelta?: (delta: { content: string; reasoningContent: string }) => void;
};

export type ChatCompletionResult = {
  content: string;
  reasoningContent?: string;
};

function parseSseChunk(
  line: string,
  state: { content: string; reasoningContent: string },
  onDelta?: ChatCompletionOptions['onDelta'],
) {
  const trimmed = line.trim();
  if (!trimmed || !trimmed.startsWith('data:')) return;

  const data = trimmed.slice(5).trim();
  if (data === '[DONE]') return;

  try {
    const parsed = JSON.parse(data);
    const delta = parsed.choices?.[0]?.delta;
    let changed = false;

    if (delta?.reasoning_content) {
      state.reasoningContent += delta.reasoning_content;
      changed = true;
    }
    if (delta?.content) {
      state.content += delta.content;
      changed = true;
    }

    if (changed) {
      onDelta?.({ content: state.content, reasoningContent: state.reasoningContent });
    }
  } catch {
    /* skip malformed chunks */
  }
}

export async function chatCompletion({
  model,
  messages,
  stream = true,
  temperature = 0.7,
  maxTokens = 2048,
  enableThinking = false,
  onDelta,
}: ChatCompletionOptions): Promise<ChatCompletionResult> {
  assertFreeQuota();

  const body: Record<string, unknown> = {
    model,
    messages,
    stream,
    temperature,
    max_tokens: maxTokens,
  };

  if (enableThinking) {
    body.chat_template_kwargs = { enable_thinking: true };
  }

  const res = await fetch(resolveUrl('/chat/completions'), {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `请求失败 (${res.status})`);
  }

  recordFreeUsage();

  if (!stream) {
    const data = await res.json();
    const message = data.choices?.[0]?.message;
    return {
      content: message?.content ?? '',
      reasoningContent: message?.reasoning_content || undefined,
    };
  }

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  const state = { content: '', reasoningContent: '' };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      parseSseChunk(line, state, onDelta);
    }
  }

  if (buffer.trim()) {
    parseSseChunk(buffer, state, onDelta);
  }

  return {
    content: state.content,
    reasoningContent: state.reasoningContent || undefined,
  };
}

export async function generateImage({
  model,
  prompt,
  size = '1024x1024',
  n = 1,
  image,
}: {
  model: string;
  prompt: string;
  size?: string;
  n?: number;
  image?: string;
}) {
  assertFreeQuota();

  const body: Record<string, unknown> = { model, prompt, size, n };
  if (image) {
    body.extra_body = { image: [image] };
  }

  const res = await fetch(resolveUrl('/images/generations'), {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `图像生成失败 (${res.status})`);
  }
  recordFreeUsage();
  return data;
}

export async function createVideoTask({
  model,
  prompt,
  width = 1152,
  height = 768,
  numFrames = 121,
  frameRate = 24,
  image,
}: {
  model: string;
  prompt: string;
  width?: number;
  height?: number;
  numFrames?: number;
  frameRate?: number;
  image?: string;
}) {
  assertFreeQuota();

  const body: Record<string, unknown> = {
    model,
    prompt,
    width,
    height,
    num_frames: numFrames,
    frame_rate: frameRate,
  };
  if (image) body.image = image;

  const res = await fetch(resolveUrl('/videos'), {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (res.status === 429) {
    throw new Error('请求过于频繁（RPM 限制 20 次/分钟），请稍后再试');
  }
  if (!res.ok) {
    throw new Error(data.error?.message || data.error || `视频任务创建失败 (${res.status})`);
  }
  recordFreeUsage();
  return data;
}

function extractVideoUrl(data: Record<string, unknown>) {
  const output = data.output as { url?: string } | undefined;
  return (
    data.remixed_from_video_id ||
    data.video_url ||
    data.url ||
    output?.url
  ) as string | undefined;
}

/** 推荐方式：用 video_id 查询（/agnesapi，不在 /v1 下） */
export async function getVideoByVideoId(videoId: string) {
  const query = `video_id=${encodeURIComponent(videoId)}&model_name=agnes-video-v2.0`;
  const res = await fetch(resolveAgnesApiUrl(query), { headers: headers() });
  const data = await res.json();
  if (res.status === 429) {
    throw new Error('轮询过于频繁（RPM 限制 20 次/分钟），请稍后再试');
  }
  if (!res.ok) {
    throw new Error(data.error?.message || data.error || `查询视频失败 (${res.status})`);
  }
  return data;
}

/** @deprecated 用 task_id 查询会导致长时间 queued，仅作兜底 */
export async function getVideoByTaskId(taskId: string) {
  const res = await fetch(resolveUrl(`/videos/${taskId}`), { headers: headers() });
  const data = await res.json();
  if (res.status === 429) {
    throw new Error('轮询过于频繁（RPM 限制 20 次/分钟），请稍后再试');
  }
  if (!res.ok) {
    throw new Error(data.error?.message || data.error || `查询任务失败 (${res.status})`);
  }
  return data;
}

type PollVideoOptions = {
  onProgress?: (payload: {
    status: string;
    progress: number;
    data?: Record<string, unknown>;
    videoId: string;
  }) => void;
  interval?: number;
  maxAttempts?: number;
};

/** 视频异步轮询：必须用 video_id，间隔 5s，最长等待 30 分钟 */
export async function pollVideoTask(
  videoId: string,
  { onProgress, interval = 5000, maxAttempts = 360 }: PollVideoOptions = {},
) {
  if (!videoId) {
    throw new Error('未返回 video_id，无法查询视频结果');
  }

  for (let i = 0; i < maxAttempts; i++) {
    const data = await getVideoByVideoId(videoId);
    const status = data.status;
    const progress = data.progress ?? 0;

    onProgress?.({ status, progress, data, videoId });

    if (status === 'completed') {
      const videoUrl = extractVideoUrl(data);
      if (!videoUrl) {
        throw new Error('任务已完成但未返回视频地址（remixed_from_video_id 为空）');
      }
      return { ...data, videoUrl };
    }
    if (status === 'failed') {
      const errMsg = typeof data.error === 'object'
        ? data.error?.message
        : data.error;
      throw new Error(errMsg || '视频生成失败');
    }

    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error('视频生成超时（已等待 30 分钟），如仍 queued 请确认使用了 video_id 查询');
}
