const API_KEY_STORAGE = 'agnes_api_key';
const AGNES_API_HOST = 'https://apihub.agnes-ai.com';
const AGNES_API_BASE = `${AGNES_API_HOST}/v1`;

const envApiKey = process.env.NEXT_PUBLIC_AGNES_API_KEY || '';

if (typeof window !== 'undefined' && envApiKey && localStorage.getItem(API_KEY_STORAGE) === envApiKey) {
  localStorage.removeItem(API_KEY_STORAGE);
}

export function getUserApiKey() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

export function setUserApiKey(key: string) {
  if (typeof window === 'undefined') return;
  if (key) {
    localStorage.setItem(API_KEY_STORAGE, key);
  } else {
    localStorage.removeItem(API_KEY_STORAGE);
  }
}

export function getStoredApiKey() {
  return getUserApiKey() || envApiKey;
}

export function hasConfiguredKey() {
  return Boolean(getStoredApiKey());
}

export function isEnvKeyActive() {
  return Boolean(envApiKey) && !getUserApiKey();
}

function resolveUrl(path) {
  return `${AGNES_API_BASE}${path}`;
}

function headers() {
  const h = { 'Content-Type': 'application/json' };
  const key = getStoredApiKey();
  if (!key) throw new Error('请先在顶部填写 API Key');
  h.Authorization = `Bearer ${key}`;
  return h;
}

export async function chatCompletion({
  model,
  messages,
  stream = true,
  temperature = 0.7,
  maxTokens = 2048,
  enableThinking = false,
}) {
  const body = {
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

  if (!stream) {
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') continue;
      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content || '';
        if (delta) fullText += delta;
      } catch {
        /* skip malformed chunks */
      }
    }
  }

  return fullText;
}

export async function generateImage({ model, prompt, size = '1024x1024', n = 1, image }) {
  const body = { model, prompt, size, n };
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
}) {
  const body = {
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
  return data;
}

function extractVideoUrl(data) {
  return data.remixed_from_video_id || data.video_url || data.url || data.output?.url;
}

/** 推荐方式：用 video_id 查询（/agnesapi，不在 /v1 下） */
export async function getVideoByVideoId(videoId) {
  const url = `${AGNES_API_HOST}/agnesapi?video_id=${encodeURIComponent(videoId)}&model_name=agnes-video-v2.0`;
  const res = await fetch(url, { headers: headers() });
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
export async function getVideoByTaskId(taskId) {
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

/** 视频异步轮询：必须用 video_id，间隔 5s，最长等待 30 分钟 */
export async function pollVideoTask(videoId, { onProgress, interval = 5000, maxAttempts = 360 } = {}) {
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
