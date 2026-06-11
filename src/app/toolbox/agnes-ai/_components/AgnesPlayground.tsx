'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from './Sidebar';
import ChatPanel from './ChatPanel';
import UniversalChatPanel from './UniversalChatPanel';
import ImagePanel from './ImagePanel';
import VideoPanel from './VideoPanel';
import WorkDetailModal from './WorkDetailModal';
import WorksCardList from './WorksCardList';
import { useWorks } from '../_context/WorksContext';
import { useResumeVideoWorks } from '../_hooks/useResumeVideoWorks';
import { MODEL_CATEGORIES, DEFAULT_MODEL, UNIVERSAL_MODEL, type Model } from '../_lib/models';
import {
  FREE_USAGE_LIMIT,
  getFreeUsageRemaining,
  getUserApiKey,
  isUsingSharedKey,
} from '../_lib/api/client';
import ApiKeyModal from './ApiKeyModal';
import '../_styles/agnes-app.css';

function Panel({ model }: { model: Model }) {
  switch (model.type) {
    case 'universal':
      return <UniversalChatPanel model={model} />;
    case 'text':
      return <ChatPanel model={model} />;
    case 'image':
      return <ImagePanel model={model} />;
    case 'video':
      return <VideoPanel model={model} />;
    default:
      return null;
  }
}

export default function AgnesPlayground() {
  const [activeView, setActiveView] = useState('create');
  const [activeModel, setActiveModel] = useState(DEFAULT_MODEL);
  const [freeRemaining, setFreeRemaining] = useState(() => getFreeUsageRemaining());
  const [usingSharedKey, setUsingSharedKey] = useState(() => isUsingSharedKey());
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const { selectedWork, closeWork } = useWorks();

  useResumeVideoWorks();

  const syncKeyState = () => {
    setUsingSharedKey(isUsingSharedKey());
    setFreeRemaining(getFreeUsageRemaining());
  };

  useEffect(() => {
    window.addEventListener('agnes-free-usage-update', syncKeyState);
    window.addEventListener('agnes-api-key-update', syncKeyState);
    return () => {
      window.removeEventListener('agnes-free-usage-update', syncKeyState);
      window.removeEventListener('agnes-api-key-update', syncKeyState);
    };
  }, []);

  const hasCustomKey = !usingSharedKey && Boolean(getUserApiKey());

  return (
    <div className="app">
      <div className="grain" aria-hidden="true" />

      <header className="topbar">
        <div className="brand">
          <Link href="/toolbox" className="btn-ghost back-link">
            ← 返回工具箱
          </Link>
          <span className="brand-mark">A</span>
          <div>
            <h1>Agnes AI</h1>
            <span className="brand-sub">Playground</span>
          </div>
        </div>

        <div className="topbar-actions">
          {usingSharedKey && (
            <span className={`free-quota ${freeRemaining === 0 ? 'free-quota--empty' : ''}`}>
              <span className="free-quota-icon" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </span>
              <span className="free-quota-text">
                免费剩余 <em>{freeRemaining}</em>/{FREE_USAGE_LIMIT} 次
              </span>
            </span>
          )}
          <button
            type="button"
            className={`api-key-btn ${hasCustomKey ? 'api-key-btn--active' : ''}`}
            onClick={() => setApiKeyModalOpen(true)}
          >
            <span className="api-key-btn-icon" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="15" r="4" />
                <path d="M11 15h11M17 11l4-4" />
              </svg>
            </span>
            {hasCustomKey ? '我的 Key' : '使用自己的 Key'}
          </button>
        </div>
      </header>

      <div className="layout">
        <Sidebar
          universalModel={UNIVERSAL_MODEL}
          categories={MODEL_CATEGORIES}
          activeModel={activeModel}
          activeView={activeView}
          onViewChange={setActiveView}
          onSelect={(model: Model) => {
            setActiveModel(model);
            setActiveView('create');
          }}
        />
        <main className="main">
          {activeView === 'works' ? (
            <WorksCardList />
          ) : (
            <Panel key={activeModel.id} model={activeModel} />
          )}
        </main>
      </div>

      <WorkDetailModal work={selectedWork} onClose={closeWork} />
      {apiKeyModalOpen && (
        <ApiKeyModal
          onClose={() => setApiKeyModalOpen(false)}
          onSaved={syncKeyState}
        />
      )}
    </div>
  );
}
