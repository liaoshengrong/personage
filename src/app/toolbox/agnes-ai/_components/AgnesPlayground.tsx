'use client';

import { useState } from 'react';
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
import { MODEL_CATEGORIES, DEFAULT_MODEL, UNIVERSAL_MODEL } from '../_lib/models';
import { setUserApiKey, isEnvKeyActive } from '../_lib/api/client';
import '../_styles/agnes-app.css';

type Model = (typeof MODEL_CATEGORIES)[number]['models'][number] | typeof UNIVERSAL_MODEL;

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
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const envConfigured = isEnvKeyActive();
  const { selectedWork, closeWork } = useWorks();

  useResumeVideoWorks();

  const saveKey = (value: string) => {
    setInputKey(value);
    setUserApiKey(value);
    if (!value) setShowKey(false);
  };

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

        <div className="api-key-field">
          <label htmlFor="api-key">
            API Key
            {envConfigured && !inputKey && (
              <span className="key-status">已配置</span>
            )}
          </label>
          <div className="api-key-input">
            <input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => saveKey(e.target.value)}
              placeholder={envConfigured ? '已在 .env 中配置，输入可覆盖' : '请输入 API Key'}
              autoComplete="off"
            />
            {inputKey && (
              <button type="button" className="btn-ghost" onClick={() => setShowKey((v) => !v)}>
                {showKey ? '隐藏' : '显示'}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="layout">
        <Sidebar
          universalModel={UNIVERSAL_MODEL}
          categories={MODEL_CATEGORIES}
          activeModel={activeModel}
          activeView={activeView}
          onViewChange={setActiveView}
          onSelect={(model) => {
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
    </div>
  );
}
