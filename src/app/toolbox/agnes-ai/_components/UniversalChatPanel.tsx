'use client';

import { useState, useRef, useEffect } from 'react';
import MDRender from '@/app/_components/MDRender';
import {
  generateImage,
  createVideoTask,
  pollVideoTask,
} from '../_lib/api/client';
import { routeUserMessage, type RouteResult } from '../_lib/router';
import { useWorks } from '../_context/WorksContext';
import { createWorkId, WORK_STATUS } from '../_lib/store/works';
import type { Model } from '../_lib/models';

type ChatMessage = {
  role: string;
  content: string;
  attachment?: { url: string; type: 'video' | 'image' };
  isError?: boolean;
  status?: string;
  routeLabel?: string;
  generatedMedia?: { type: 'video' | 'image'; url: string };
  revisedPrompt?: string;
};

const VIDEO_STATUS_LABEL: Record<string, string> = {
  queued: '排队中',
  in_progress: '生成中',
  processing: '处理中',
  completed: '已完成',
  failed: '失败',
};

function updateLastAssistant(
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  patch: Partial<ChatMessage>,
) {
  setMessages((prev) => {
    const updated = [...prev];
    const last = updated[updated.length - 1];
    if (last?.role === 'assistant') {
      updated[updated.length - 1] = { ...last, ...patch };
    }
    return updated;
  });
}

export default function UniversalChatPanel({ model }: { model: Model }) {
  const { addWork, updateWork } = useWorks();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '你好！我是通用对话助手，会自动判断你的需求并调用合适的模型。你可以直接聊天、描述想生成的图片或视频。',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<{ url: string; type: 'video' | 'image' } | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const runImageGeneration = async ({
    route,
    userText,
    currentAttachment,
    assistantIndex,
  }: {
    route: RouteResult;
    userText: string;
    currentAttachment: { url: string; type: 'video' | 'image' } | null;
    assistantIndex: number;
  }) => {
    const prompt = route.prompt || userText;
    const workId = createWorkId();

    addWork({
      id: workId,
      type: 'image',
      modelId: route.modelId,
      modelName: route.model?.name || route.modelId,
      prompt,
      status: WORK_STATUS.GENERATING,
      url: null,
      error: null,
      videoId: null,
      progress: 0,
      subStatus: null,
      createdAt: Date.now(),
      completedAt: null,
      meta: { size: '1024x1024' },
    });

    updateLastAssistant(setMessages, {
      status: `正在使用 ${route.model?.name || route.modelId} 生成图像…`,
    });

    const data = await generateImage({
      model: route.modelId,
      prompt,
      size: '1024x1024',
      image: currentAttachment?.type === 'image' ? currentAttachment.url : undefined,
    });

    const item = data.data?.[0];
    const url = item?.url || (item?.b64_json ? `data:image/png;base64,${item.b64_json}` : null);
    if (!url) throw new Error('未返回图像数据');

    updateWork(workId, {
      status: WORK_STATUS.COMPLETED,
      url,
      completedAt: Date.now(),
    });

    setMessages((prev) => {
      const updated = [...prev];
      updated[assistantIndex] = {
        role: 'assistant',
        content: '',
        routeLabel: `已通过 ${route.model?.name || route.modelId} 生成图像`,
        generatedMedia: { type: 'image', url },
        revisedPrompt: item?.revised_prompt,
      };
      return updated;
    });
  };

  const runVideoGeneration = async ({
    route,
    userText,
    currentAttachment,
    assistantIndex,
  }: {
    route: RouteResult;
    userText: string;
    currentAttachment: { url: string; type: 'video' | 'image' } | null;
    assistantIndex: number;
  }) => {
    const prompt = route.prompt || userText;
    const workId = createWorkId();

    addWork({
      id: workId,
      type: 'video',
      modelId: route.modelId,
      modelName: route.model?.name || route.modelId,
      prompt,
      status: WORK_STATUS.GENERATING,
      url: null,
      error: null,
      videoId: null,
      progress: 0,
      subStatus: 'queued',
      createdAt: Date.now(),
      completedAt: null,
      meta: {
        numFrames: 121,
        frameRate: 24,
        resolution: '1152x768',
      },
    });

    updateLastAssistant(setMessages, {
      status: `正在使用 ${route.model?.name || route.modelId} 创建视频任务…`,
    });

    const task = await createVideoTask({
      model: route.modelId,
      prompt,
      width: 1152,
      height: 768,
      numFrames: 121,
      frameRate: 24,
      image: currentAttachment?.type === 'image' ? currentAttachment.url : undefined,
    });

    const videoId = task.video_id || task.id;
    if (!videoId) throw new Error('未返回 video_id');

    updateWork(workId, { videoId, subStatus: 'queued' });

    const result = await pollVideoTask(videoId, {
      onProgress: ({ status, progress }) => {
        updateWork(workId, { progress, subStatus: status });
        updateLastAssistant(setMessages, {
          status: `视频生成中：${VIDEO_STATUS_LABEL[status] || status} ${progress}%`,
        });
      },
    });

    updateWork(workId, {
      status: WORK_STATUS.COMPLETED,
      url: result.videoUrl,
      progress: 100,
      subStatus: 'completed',
      completedAt: Date.now(),
    });

    setMessages((prev) => {
      const updated = [...prev];
      updated[assistantIndex] = {
        role: 'assistant',
        content: '',
        routeLabel: `已通过 ${route.model?.name || route.modelId} 生成视频`,
        generatedMedia: { type: 'video', url: result.videoUrl },
      };
      return updated;
    });
  };

  const send = async () => {
    const text = input.trim();
    const currentAttachment = attachment;
    if ((!text && !currentAttachment) || loading) return;

    const userMsg = {
      role: 'user',
      content: text,
      ...(currentAttachment ? { attachment: currentAttachment } : {}),
    };
    const nextMessages = [...messages.filter((m) => m.role !== 'system'), userMsg];
    const assistantIndex = nextMessages.length;

    setMessages([
      ...nextMessages,
      { role: 'assistant', content: '', status: '正在分析你的需求…' },
    ]);
    setInput('');
    setAttachment(null);
    if (fileRef.current) fileRef.current.value = '';
    setLoading(true);

    try {
      const route = await routeUserMessage({ text, attachment: currentAttachment });

      if (route.target === 'text') {
        setMessages((prev) => {
          const updated = [...prev];
          updated[assistantIndex] = {
            role: 'assistant',
            content: route.reply || '（无响应内容）',
          };
          return updated;
        });
        return;
      }

      if (route.target === 'image') {
        await runImageGeneration({ route, userText: text, currentAttachment, assistantIndex });
        return;
      }

      if (route.target === 'video') {
        await runVideoGeneration({ route, userText: text, currentAttachment, assistantIndex });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误';
      setMessages((prev) => {
        const updated = [...prev];
        updated[assistantIndex] = {
          role: 'assistant',
          content: `❌ ${message}`,
          isError: true,
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="panel chat-panel universal-panel">
      <header className="panel-header">
        <div>
          <h2>{model.name}</h2>
          <p>{model.description}</p>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role} ${msg.isError ? 'error' : ''}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? '你' : 'AI'}
            </div>
            <div className="message-body">
              {loading && i === messages.length - 1 && msg.role === 'assistant' && !msg.content && !msg.generatedMedia ? (
                <>
                  {msg.status && <p className="message-status">{msg.status}</p>}
                  <span className="typing">
                    <span /><span /><span />
                  </span>
                </>
              ) : (
                <>
                  {msg.routeLabel && (
                    <p className="route-label">{msg.routeLabel}</p>
                  )}
                  {msg.attachment?.url && (
                    <div className="message-media">
                      {msg.attachment.type === 'video' ? (
                        <video src={msg.attachment.url} controls playsInline />
                      ) : (
                        <img src={msg.attachment.url} alt="用户上传的图片" />
                      )}
                    </div>
                  )}
                  {msg.generatedMedia && (
                    <div className="message-media">
                      {msg.generatedMedia.type === 'video' ? (
                        <video src={msg.generatedMedia.url} controls playsInline />
                      ) : (
                        <img src={msg.generatedMedia.url} alt="生成结果" />
                      )}
                    </div>
                  )}
                  {msg.revisedPrompt && (
                    <p className="revised-prompt-inline">优化 Prompt：{msg.revisedPrompt}</p>
                  )}
                  {msg.content ? (
                    msg.role === 'assistant' && !msg.isError ? (
                      <div className="message-md">
                        <MDRender content={msg.content} />
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )
                  ) : null}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-attachments">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result !== 'string') return;
                setAttachment({
                  url: reader.result,
                  type: file.type.startsWith('video/') ? 'video' : 'image',
                });
              };
              reader.readAsDataURL(file);
            }}
          />
          <button
            type="button"
            className="btn-ghost"
            onClick={() => fileRef.current?.click()}
            disabled={loading}
          >
            上传图片/视频
          </button>
          {attachment && (
            <>
              <div className="attach-preview">
                {attachment.type === 'video' ? (
                  <video src={attachment.url} muted playsInline />
                ) : (
                  <img src={attachment.url} alt="待发送图片" />
                )}
              </div>
              <span className="attach-name">已附加媒体</span>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setAttachment(null);
                  if (fileRef.current) fileRef.current.value = '';
                }}
              >
                移除
              </button>
            </>
          )}
        </div>
        <div className="chat-input-row">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="随便聊、描述想生成的图片或视频… Enter 发送"
            rows={3}
            disabled={loading}
          />
          <button
            type="button"
            className="btn-primary"
            onClick={send}
            disabled={loading || (!input.trim() && !attachment)}
          >
            {loading ? '处理中…' : '发送'}
          </button>
        </div>
      </div>
    </div>
  );
}
