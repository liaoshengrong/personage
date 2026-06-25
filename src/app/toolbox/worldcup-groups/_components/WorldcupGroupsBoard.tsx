'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GROUPS,
  MAX_PTS,
  type GroupLetter,
  type Team,
} from '../_data';
import {
  formatGd,
  gdClass,
  getGoalDiff,
  getTeamMatches,
  outcomeLabel,
  type TeamMatch,
} from '../_lib/matches';
import ThirdPlaceTable from './ThirdPlaceTable';
import LineupModal from './LineupModal';
import { enrichMatchPreview, getMatchLineupPreview } from '../_data/matchLineups';
import { findFixture } from '../_lib/fixtureLookup';
import type { MatchLineupPreview } from '../_data/lineupTypes';

function MatchBlock({
  title,
  titleClass,
  matches,
  played,
  teamName,
  onUpcomingClick,
}: {
  title: string;
  titleClass: string;
  matches: TeamMatch[];
  played: boolean;
  teamName: string;
  onUpcomingClick: (teamName: string, opponent: string, md: number, date: string) => void;
}) {
  if (!matches.length) return null;

  return (
    <div className="match-block">
      <div className={`match-block-title ${titleClass}`}>
        {title} · {matches.length}
      </div>
      {matches.map((m) =>
        played && m.played ? (
          <div key={`${m.md}-${m.opponent}`} className={`match-line ${m.outcome}`}>
            <span className="match-opponent">
              <em>{m.venue}</em>vs {m.opponent}
            </span>
            <span className="match-meta">
              R{m.md} · {m.date}
            </span>
            <span className={`match-result ${m.outcome}`}>
              <span className={`result-badge ${m.outcome}`}>
                {outcomeLabel(m.outcome)}
              </span>
              {m.score}
            </span>
          </div>
        ) : (
          <button
            key={`${m.md}-${m.opponent}`}
            type="button"
            className="match-line upcoming clickable"
            onClick={(e) => {
              e.stopPropagation();
              onUpcomingClick(teamName, m.opponent, m.md, m.date);
            }}
          >
            <span className="match-opponent">
              <em>{m.venue}</em>vs {m.opponent}
            </span>
            <span className="match-meta">
              R{m.md} · {m.date}
            </span>
            <span className="match-result pending">
              预测阵容
              <span className="match-line-hint" aria-hidden="true">
                ›
              </span>
            </span>
          </button>
        ),
      )}
    </div>
  );
}

function MatchPanel({
  teamName,
  groupLetter,
  onUpcomingClick,
}: {
  teamName: string;
  groupLetter: GroupLetter;
  onUpcomingClick: (teamName: string, opponent: string, md: number, date: string) => void;
}) {
  const all = getTeamMatches(teamName, groupLetter);
  const played = all.filter((m): m is Extract<TeamMatch, { played: true }> => m.played);
  const upcoming = all.filter((m) => !m.played);

  return (
    <div className="match-panel-inner">
      <div className="match-panel-content">
        <MatchBlock
          title="已赛"
          titleClass="played"
          matches={played}
          played
          teamName={teamName}
          onUpcomingClick={onUpcomingClick}
        />
        <MatchBlock
          title="未赛"
          titleClass="upcoming"
          matches={upcoming}
          played={false}
          teamName={teamName}
          onUpcomingClick={onUpcomingClick}
        />
      </div>
    </div>
  );
}

function TeamItem({
  team,
  index,
  letter,
  leaderPts,
  expanded,
  onToggle,
  onUpcomingClick,
}: {
  team: Team;
  index: number;
  letter: GroupLetter;
  leaderPts: number;
  expanded: boolean;
  onToggle: () => void;
  onUpcomingClick: (teamName: string, opponent: string, md: number, date: string) => void;
}) {
  const isLeader = index === 0 && team.pts === leaderPts && team.pts > 0;
  const playedCount = getTeamMatches(team.name, letter).filter((m) => m.played).length;
  const isElim = team.pts === 0 && playedCount >= 2;
  const barPct = (team.pts / MAX_PTS) * 100;
  const gd = getGoalDiff(team.name, letter);

  const rowClass = [
    'team-row',
    isLeader && 'leader',
    isElim && 'eliminated',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={`team-item${expanded ? ' expanded' : ''}`}>
      <button
        type="button"
        className={rowClass}
        aria-expanded={expanded}
        aria-controls={`matches-${letter}-${index}`}
        onClick={onToggle}
      >
        <span className="pos">{index + 1}</span>
        <div className="team-info">
          <div className="team-name">{team.name}</div>
          <div className="pts-bar-wrap" aria-hidden="true">
            <div
              className="pts-bar"
              style={{ width: `${barPct}%` }}
            />
          </div>
        </div>
        <span className="fifa-rank">
          <em>#</em>
          {team.fifa}
        </span>
        <span className={`gd-value ${gdClass(gd)}`}>{formatGd(gd)}</span>
        <span className="pts-value">{team.pts}</span>
        <span className="expand-icon" aria-hidden="true">
          ▼
        </span>
      </button>
      <div
        className="match-panel"
        id={`matches-${letter}-${index}`}
        role="region"
        aria-label={`${team.name} 赛程`}
      >
        <MatchPanel
          teamName={team.name}
          groupLetter={letter}
          onUpcomingClick={onUpcomingClick}
        />
      </div>
    </li>
  );
}

function GroupCard({
  letter,
  teams,
  animationIndex,
  expandedKey,
  onExpand,
  onUpcomingClick,
}: {
  letter: GroupLetter;
  teams: Team[];
  animationIndex: number;
  expandedKey: string | null;
  onExpand: (key: string | null) => void;
  onUpcomingClick: (teamName: string, opponent: string, md: number, date: string) => void;
}) {
  const leaderPts = teams[0].pts;

  return (
    <article
      className="group-card"
      style={{ animationDelay: `${0.05 * animationIndex}s` }}
      aria-label={`${letter} 组积分榜`}
    >
      <div className="group-watermark" aria-hidden="true">
        {letter}
      </div>
      <div className="group-header">
        <span className="group-label">{letter} 组</span>
      </div>
      <div className="group-cols-head">
        <span className="col-head">排名</span>
        <span />
        <span className="col-head col-fifa" title="FIFA 赛后实时排名，截至 2026.06.24">
          世界排名
        </span>
        <span className="col-head col-gd">净球</span>
        <span className="col-head col-pts">积分</span>
        <span />
      </div>
      <ol className="team-list">
        {teams.map((team, i) => {
          const key = `${letter}-${i}`;
          return (
            <TeamItem
              key={key}
              team={team}
              index={i}
              letter={letter}
              leaderPts={leaderPts}
              expanded={expandedKey === key}
              onToggle={() => onExpand(expandedKey === key ? null : key)}
              onUpcomingClick={onUpcomingClick}
            />
          );
        })}
      </ol>
    </article>
  );
}

export default function WorldcupGroupsBoard() {
  const [expandedByGroup, setExpandedByGroup] = useState<
    Record<string, string | null>
  >({});
  const [lineupPreview, setLineupPreview] = useState<MatchLineupPreview | null>(
    null,
  );

  const handleExpand = (letter: GroupLetter, key: string | null) => {
    setExpandedByGroup((prev) => ({ ...prev, [letter]: key }));
  };

  const handleUpcomingClick = (
    letter: GroupLetter,
    teamName: string,
    opponent: string,
    md: number,
    date: string,
  ) => {
    const fixture = findFixture(letter, teamName, opponent, md);
    if (!fixture || fixture.played) return;
    const preview = getMatchLineupPreview(letter, fixture.home, fixture.away, md);
    if (!preview) return;
    setLineupPreview(enrichMatchPreview(preview, date));
  };

  return (
    <div className="worldcup-groups">
      <div className="bg-layer" />
      <div className="pitch-lines">
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          stroke="#c9a227"
          strokeWidth="1"
        >
          <circle cx="720" cy="450" r="80" />
          <line x1="720" y1="0" x2="720" y2="900" />
          <rect x="40" y="200" width="120" height="500" rx="2" />
          <rect x="1280" y="200" width="120" height="500" rx="2" />
        </svg>
      </div>

      <div className="wrap">
        <header className="page-header">
          <div className="header-top">
            <Link href="/toolbox" className="back-link" aria-label="返回工具箱">
              <span className="back-chevron" aria-hidden="true" />
              <span className="back-link-text">
                <span className="back-link-dest">工具箱</span>
                <span className="back-link-sep">/</span>
                <span className="back-link-here">积分榜</span>
              </span>
            </Link>
            <span className="header-top-mark" aria-hidden="true">
              MATCHDAY · 06.24
            </span>
          </div>

          <div className="badge">FIFA WORLD CUP 2026 · GROUP STAGE</div>
          <h1 className="page-title">
            小组积分榜
            <span>48 支球队 · 12 个小组 · 数据截至 2026.06.24</span>
          </h1>
          <div className="header-meta">
            <div className="meta-item">
              <strong>12</strong>个小组
            </div>
            <div className="meta-item">
              <strong>48</strong>参赛队
            </div>
            <div className="meta-item">
              <strong>9</strong>最高积分
            </div>
            <div className="meta-item">
              <strong>美加墨</strong>联合举办
            </div>
          </div>
        </header>

        <div className="strategy-banner">
          <p>
            实时追踪世界排名与小组赛积分。点击球队展开赛程；<strong>点击未赛场次</strong>
            查看预测阵容。榜首金色高亮；已赛 2 场且 0 分标记 OUT。
          </p>
        </div>

        <div className="section-label">12 GROUPS · 积分榜</div>

        <div className="legend" role="note">
          <div className="legend-item">
            <span className="legend-dot leader" />
            小组榜首
          </div>
          <div className="legend-item">
            <span className="legend-dot qualify" />
            积分进度条
          </div>
          <div className="legend-item">
            <span className="legend-dot out" />
            已赛 2 场 · 0 分出局
          </div>
          <div className="legend-item">未赛场次 · 预测阵容</div>
        </div>

        <main className="groups-grid">
          {(Object.entries(GROUPS) as [GroupLetter, Team[]][]).map(
            ([letter, teams], gi) => (
              <GroupCard
                key={letter}
                letter={letter}
                teams={teams}
                animationIndex={gi}
                expandedKey={expandedByGroup[letter] ?? null}
                onExpand={(key) => handleExpand(letter, key)}
                onUpcomingClick={(teamName, opponent, md, date) =>
                  handleUpcomingClick(letter, teamName, opponent, md, date)
                }
              />
            ),
          )}
        </main>

        <ThirdPlaceTable />

        <footer className="page-footer">
          WC 2026 · GROUP STANDINGS · FOR REFERENCE ONLY
        </footer>
      </div>

      <LineupModal preview={lineupPreview} onClose={() => setLineupPreview(null)} />
    </div>
  );
}
