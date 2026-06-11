'use client';

import type { ReactNode, RefObject } from 'react';

const BADGE_ICONS = {
  image: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="8.5" cy="10" r="1.75" fill="currentColor" />
      <path d="M3 16l5.5-5 4 3.5L15 12l6 5" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  ),
  video: (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16 10l6-3v10l-6-3v-4z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  ),
};

type PromptComposerProps = {
  id: string;
  label: string;
  tip?: string;
  variant: 'image' | 'video';
  badgeLabel: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
  actions: ReactNode;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
  readOnly?: boolean;
};

export function PromptChip({
  children,
  accent,
  disabled,
  onClick,
}: {
  children: ReactNode;
  accent?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`prompt-chip${accent ? ' prompt-chip-accent' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function OptimizeIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3l1.2 3.6L17 8l-3.8 1.4L12 13l-1.2-3.6L7 8l3.8-1.4L12 3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M5 16l.8 2.4L8 19l-2.5.9L5 22l-.8-2.1L2 19l2.5-.9L5 16zM19 14l.6 1.8L21 16.5l-1.9.7L19 19l-.6-1.8L17 16.5l1.9-.7L19 14z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RandomIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PromptComposer({
  id,
  label,
  tip,
  variant,
  badgeLabel,
  value,
  onChange,
  placeholder,
  rows = 12,
  actions,
  inputRef,
  readOnly = false,
}: PromptComposerProps) {
  return (
    <div className="prompt-field">
      <div className="prompt-field-head">
        <label htmlFor={id}>{label}</label>
        {tip ? <span className="prompt-field-tip">{tip}</span> : null}
      </div>
      <div className={`prompt-composer prompt-composer--${variant}`}>
        <div className="prompt-composer-glow" aria-hidden="true" />
        <textarea
          id={id}
          ref={inputRef}
          className="prompt-composer-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          readOnly={readOnly}
        />
        <div className="prompt-composer-bar">
          <div className="prompt-composer-bar-start">
            <span className="prompt-composer-badge">
              {BADGE_ICONS[variant]}
              {badgeLabel}
            </span>
            {value.length > 0 ? (
              <span className="prompt-composer-count">{value.length} 字</span>
            ) : null}
          </div>
          <div className="prompt-composer-actions">{actions}</div>
        </div>
      </div>
    </div>
  );
}
