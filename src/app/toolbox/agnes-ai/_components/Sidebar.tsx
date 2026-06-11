'use client';

import { useState } from 'react';
import type { Model } from '../_lib/models';

type Category = {
  id: string;
  label: string;
  models: Model[];
};

type SidebarProps = {
  universalModel: Model;
  categories: Category[];
  activeModel: Model;
  activeView: string;
  onViewChange: (view: string) => void;
  onSelect: (model: Model) => void;
};

export default function Sidebar({
  universalModel,
  categories,
  activeModel,
  activeView,
  onViewChange,
  onSelect,
}: SidebarProps) {
  const [expanded, setExpanded] = useState(() =>
    Object.fromEntries(categories.map((c) => [c.id, true])),
  );

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-label">模型</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-universal">
          <button
            type="button"
            className={`model-item universal-item ${activeView === 'create' && activeModel.id === universalModel.id ? 'active' : ''}`}
            onClick={() => onSelect(universalModel)}
          >
            {universalModel.name}
          </button>
          <p className="universal-hint">{universalModel.description}</p>
        </div>

        {categories.map((category) => (
          <div key={category.id} className="category">
            <button
              type="button"
              className="category-toggle"
              onClick={() => toggle(category.id)}
              aria-expanded={expanded[category.id]}
            >
              <span>{category.label}</span>
              <svg
                className={`chevron ${expanded[category.id] ? 'open' : ''}`}
                viewBox="0 0 12 12"
                fill="none"
              >
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            {expanded[category.id] && (
              <ul className="model-list">
                {category.models.map((model) => (
                  <li key={model.id}>
                    <button
                      type="button"
                      className={`model-item ${activeView === 'create' && activeModel.id === model.id ? 'active' : ''}`}
                      onClick={() => onSelect(model)}
                    >
                      {model.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className={`sidebar-works-btn ${activeView === 'works' ? 'active' : ''}`}
          onClick={() => onViewChange('works')}
        >
          我的作品
        </button>
      </div>
    </aside>
  );
}
