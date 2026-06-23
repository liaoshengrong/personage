'use client';

import { useEffect } from 'react';
import type { LineupPlayer, MatchLineupPreview } from '../_data/lineupTypes';
import type { TeamLineup } from '../_data/lineupTypes';
import { localizePlayerName } from '../_lib/localizePlayerName';
import {
  formatPlayerValue,
  getPlayerStats,
  ratingTier,
  sortPlayersByValue,
  summarizeLineup,
} from '../_lib/playerStatsDisplay';

interface LineupModalProps {
  preview: MatchLineupPreview | null;
  onClose: () => void;
}

function positionLabel(pos: string) {
  if (pos === 'GK') return '门将';
  if (pos === 'DF') return '后卫';
  if (pos === 'MF') return '中场';
  return '前锋';
}

function PlayerRow({ player }: { player: LineupPlayer }) {
  const stats = getPlayerStats(player.name);
  const tier = ratingTier(stats.rating);

  return (
    <li className="lineup-player">
      <span className="lineup-num">{player.number}</span>
      <span className="lineup-name">{localizePlayerName(player.name)}</span>
      <span className="lineup-stat lineup-age">{stats.age}岁</span>
      <span className="lineup-stat lineup-value">{formatPlayerValue(stats.value)}</span>
      <span className={`lineup-stat lineup-rating rating-${tier}`}>{stats.rating}</span>
      <span className="lineup-pos">{positionLabel(player.position)}</span>
    </li>
  );
}

function TeamLineupPanel({
  teamName,
  side,
  lineup,
}: {
  teamName: string;
  side: 'home' | 'away';
  lineup: TeamLineup;
}) {
  const starters = sortPlayersByValue(lineup.starters);
  const substitutes = sortPlayersByValue(lineup.substitutes);
  const summary = summarizeLineup([...lineup.starters, ...lineup.substitutes]);

  return (
    <div className={`lineup-panel lineup-panel-${side}`}>
      <div className="lineup-panel-head">
        <h3>{teamName}</h3>
        <span className="lineup-formation">{lineup.formation}</span>
      </div>
      <div className="lineup-team-summary">
        <span>
          总身价 <em>{formatPlayerValue(summary.totalValue)}</em>
        </span>
        <span>
          平均年龄 <em>{summary.avgAge}</em> 岁
        </span>
      </div>
      {lineup.note && <p className="lineup-team-note">{lineup.note}</p>}
      <div className="lineup-section-label">预测首发</div>
      <div className="lineup-list-head" aria-hidden="true">
        <span>#</span>
        <span>球员</span>
        <span>年龄</span>
        <span>身价 ↓</span>
        <span>能力</span>
        <span>位置</span>
      </div>
      <ul className="lineup-player-list">
        {starters.map((p) => (
          <PlayerRow key={`${p.number}-${p.name}`} player={p} />
        ))}
      </ul>
      {substitutes.length > 0 && (
        <>
          <div className="lineup-section-label sub">预测替补</div>
          <div className="lineup-list-head sub" aria-hidden="true">
            <span>#</span>
            <span>球员</span>
            <span>年龄</span>
            <span>身价 ↓</span>
            <span>能力</span>
            <span>位置</span>
          </div>
          <ul className="lineup-player-list sub">
            {substitutes.map((p) => (
              <PlayerRow key={`sub-${p.number}-${p.name}`} player={p} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function LineupModal({ preview, onClose }: LineupModalProps) {
  useEffect(() => {
    if (!preview) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [preview, onClose]);

  if (!preview) return null;

  return (
    <div
      className="lineup-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="lineup-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lineup-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="lineup-modal-header">
          <div>
            <div className="lineup-modal-badge">
              {preview.group} 组 · R{preview.md}
              {preview.date ? ` · ${preview.date}` : ''}
            </div>
            <h2 id="lineup-modal-title" className="lineup-modal-title">
              {preview.home}
              <span className="lineup-vs">vs</span>
              {preview.away}
            </h2>
            {preview.previewNote && (
              <p className="lineup-modal-note">{preview.previewNote}</p>
            )}
          </div>
          <button
            type="button"
            className="lineup-modal-close"
            aria-label="关闭"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="lineup-modal-body">
          <TeamLineupPanel
            teamName={preview.home}
            side="home"
            lineup={preview.homeLineup}
          />
          <TeamLineupPanel
            teamName={preview.away}
            side="away"
            lineup={preview.awayLineup}
          />
        </div>

        <footer className="lineup-modal-footer">
          预测阵容 · 能力值/年龄来源 EA FC 25 · 身价为转会市场参考 · 列表按综合身价排序
        </footer>
      </div>
    </div>
  );
}
