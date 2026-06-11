'use client';

import { useState } from 'react';
import { getUserApiKey, setUserApiKey } from '../_lib/api/client';

type ApiKeyModalProps = {
  onClose: () => void;
  onSaved: () => void;
};

export default function ApiKeyModal({ onClose, onSaved }: ApiKeyModalProps) {
  const [inputKey, setInputKey] = useState(() => getUserApiKey());
  const [showKey, setShowKey] = useState(false);

  const hasCustomKey = Boolean(getUserApiKey());

  const handleSave = () => {
    setUserApiKey(inputKey);
    onSaved();
    onClose();
  };

  const handleClear = () => {
    setInputKey('');
    setUserApiKey('');
    onSaved();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-card api-key-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="api-key-modal-title"
      >
        <header className="modal-header">
          <h3 id="api-key-modal-title">设置 API Key</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </header>

        <div className="modal-body">
          <p className="api-key-modal-hint">
            填写你自己的 Agnes API Key 后可无限使用；留空并清除则继续使用免费额度。
          </p>

          <label className="api-key-modal-label" htmlFor="api-key-modal-input">
            API Key
          </label>
          <div className="api-key-modal-input-row">
            <input
              id="api-key-modal-input"
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
            />
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setShowKey((v) => !v)}
            >
              {showKey ? '隐藏' : '显示'}
            </button>
          </div>

          <div className="api-key-modal-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={handleSave}
              disabled={!inputKey.trim()}
            >
              保存
            </button>
            {hasCustomKey && (
              <button type="button" className="btn-ghost" onClick={handleClear}>
                清除，使用免费额度
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
