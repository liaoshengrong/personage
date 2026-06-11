'use client';

import { useState, useRef, useEffect } from 'react';
import { chatCompletion } from '../_lib/api/client';
import type { Model } from '../_lib/models';

type ChatMessage = {
  role: string;
  content: string;
  attachment?: { url: string; type: 'video' | 'image' };
  isError?: boolean;
};

export default function ChatPanel({ model }: { model: Model }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: `你好！当前使用 **${model.name}**，有什么可以帮你的？` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [enableThinking, setEnableThinking] = useState(false);
  const [attachment, setAttachment] = useState<{ url: string; type: 'video' | 'image' } | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const supportsThinking = model.id === 'agnes-2.0-flash';
  const supportsVision = model.id === 'agnes-2.0-flash';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
    setMessages([...nextMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setAttachment(null);
    if (fileRef.current) fileRef.current.value = '';
    setLoading(true);

    try {
      const apiMessages = nextMessages.map((msg) => {
        if (msg.role === 'user' && msg.attachment?.url && supportsVision) {
          return {
            role: 'user',
            content: [
              { type: 'text', text: msg.content || '' },
              { type: 'image_url', image_url: { url: msg.attachment.url } },
            ],
          };
        }
        return { role: msg.role, content: msg.content };
      });

      const reply = await chatCompletion({
        model: model.id,
        messages: apiMessages,
        temperature,
        enableThinking: supportsThinking && enableThinking,
      });

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: reply || '（无响应内容）' };
        return updated;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : '未知错误';
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
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
    <div className="panel chat-panel">
      <header className="panel-header">
        <div>
          <h2>{model.name}</h2>
          <p>{model.description}</p>
        </div>
        <div className="panel-controls">
          <div className="param-control">
            <label htmlFor="temp">温度</label>
            <input
              id="temp"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
            />
            <span>{temperature.toFixed(1)}</span>
          </div>
          {supportsThinking && (
            <label className="toggle-control">
              <input
                type="checkbox"
                checked={enableThinking}
                onChange={(e) => setEnableThinking(e.target.checked)}
              />
              Thinking
            </label>
          )}
        </div>
      </header>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role} ${msg.isError ? 'error' : ''}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? '你' : 'AI'}
            </div>
            <div className="message-body">
              {loading && i === messages.length - 1 && msg.role === 'assistant' && !msg.content ? (
                <span className="typing">
                  <span /><span /><span />
                </span>
              ) : (
                <>
                  {msg.attachment?.url && (
                    <div className="message-media">
                      {msg.attachment.type === 'video' ? (
                        <video src={msg.attachment.url} controls playsInline />
                      ) : (
                        <img src={msg.attachment.url} alt="用户上传的图片" />
                      )}
                    </div>
                  )}
                  {msg.content ? <p>{msg.content}</p> : null}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-area">
        {supportsVision && (
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
                <button type="button" className="btn-ghost" onClick={() => {
                  setAttachment(null);
                  if (fileRef.current) fileRef.current.value = '';
                }}>
                  移除
                </button>
              </>
            )}
          </div>
        )}
        <div className="chat-input-row">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息，Enter 发送，Shift+Enter 换行…"
            rows={3}
            disabled={loading}
          />
          <button type="button" className="btn-primary" onClick={send} disabled={loading || (!input.trim() && !attachment)}>
            {loading ? '生成中…' : '发送'}
          </button>
        </div>
      </div>
    </div>
  );
}
