'use client';

import { STATUS_LABELS, type Work } from '../_lib/store/works';

type WorkDetailModalProps = {
  work: Work | null;
  onClose: () => void;
};

export default function WorkDetailModal({ work, onClose }: WorkDetailModalProps) {
  if (!work) return null;

  const statusLabel = STATUS_LABELS[work.status] || work.status;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="modal-header">
          <h3>{work.type === 'image' ? '图像作品' : '视频作品'}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="关闭">×</button>
        </header>

        <div className="modal-body">
          {work.status === 'completed' && work.url && (
            <div className="modal-preview">
              {work.type === 'image' ? (
                <img src={work.url} alt={work.prompt} />
              ) : (
                <video src={work.url} controls />
              )}
            </div>
          )}

          {work.status === 'generating' && (
            <div className="modal-preview modal-preview--pending">
              <div className="spinner" />
              <p>
                {work.subStatus ? `任务状态：${work.subStatus}` : '生成中…'}
                {work.progress > 0 && `（${work.progress}%）`}
              </p>
            </div>
          )}

          <dl className="modal-meta">
            <div className="meta-row">
              <dt>状态</dt>
              <dd>
                <span className={`status-badge status-${work.status}`}>{statusLabel}</span>
              </dd>
            </div>
            <div className="meta-row">
              <dt>模型</dt>
              <dd><code>{work.modelName}</code></dd>
            </div>
            <div className="meta-row">
              <dt>Prompt</dt>
              <dd className="meta-prompt">{work.prompt}</dd>
            </div>
            {work.url && (
              <div className="meta-row">
                <dt>链接</dt>
                <dd>
                  <a href={work.url} target="_blank" rel="noreferrer" className="btn-link">
                    打开 / 下载
                  </a>
                  <code className="meta-url">{work.url}</code>
                </dd>
              </div>
            )}
            {work.videoId && (
              <div className="meta-row">
                <dt>Video ID</dt>
                <dd><code>{work.videoId}</code></dd>
              </div>
            )}
            {work.error && (
              <div className="meta-row">
                <dt>错误</dt>
                <dd className="meta-error">{work.error}</dd>
              </div>
            )}
            <div className="meta-row">
              <dt>创建时间</dt>
              <dd>{new Date(work.createdAt).toLocaleString('zh-CN')}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
