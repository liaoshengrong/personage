'use client';

import { useWorks } from '../_context/WorksContext';
import { STATUS_LABELS } from '../_lib/store/works';

export default function WorksCardList() {
  const { works, openWork } = useWorks();
  const mediaWorks = works.filter((w) => w.type === 'image' || w.type === 'video');

  if (mediaWorks.length === 0) {
    return (
      <div className="works-page">
        <header className="works-page-header">
          <h2>我的作品</h2>
          <p>生成图像或视频后，作品会自动保存在这里</p>
        </header>
        <div className="works-page-empty">
          <span className="placeholder-icon">🎨</span>
          <p>暂无作品</p>
        </div>
      </div>
    );
  }

  return (
    <div className="works-page">
      <header className="works-page-header">
        <h2>我的作品</h2>
        <p>共 {mediaWorks.length} 件作品</p>
      </header>

      <div className="works-card-grid">
        {mediaWorks.map((work) => (
          <button
            key={work.id}
            type="button"
            className="work-card"
            onClick={() => openWork(work.id)}
          >
            <div className="work-card-media">
              {work.status === 'completed' && work.url ? (
                work.type === 'image' ? (
                  <img src={work.url} alt={work.prompt} />
                ) : (
                  <video src={work.url} muted />
                )
              ) : (
                <div className="work-card-placeholder">
                  <span>{work.type === 'image' ? '🖼' : '🎬'}</span>
                  {work.status === 'generating' && (
                    <div className="work-card-loading">
                      <div className="spinner" />
                      {work.progress > 0 && <span>{work.progress}%</span>}
                    </div>
                  )}
                </div>
              )}
              <span className={`work-card-type type-${work.type}`}>
                {work.type === 'image' ? '图像' : '视频'}
              </span>
            </div>

            <div className="work-card-body">
              <p className="work-card-prompt">{work.prompt}</p>
              <div className="work-card-meta">
                <span className="work-card-model">{work.modelName}</span>
                <span className={`work-card-status status-${work.status}`}>
                  {STATUS_LABELS[work.status]}
                </span>
              </div>
              <time className="work-card-time">
                {new Date(work.createdAt).toLocaleString('zh-CN')}
              </time>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
