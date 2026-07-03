import { GROUPS, type GroupLetter, type Team } from '../_data';
import { ROUND_OF_32_FINAL } from '../_data/roundOf32';
import { getGoalDiff, isGroupComplete, isTeamEliminated } from './matches';
import { getThirdPlaceCandidates } from './thirdPlace';

export type EliminatedReason = 'fourth' | 'early' | 'third-missed' | 'r32';

export interface EliminatedTeam {
  team: string;
  group: GroupLetter | '—';
  rank: number;
  fifa: number;
  pts: number;
  gd: number;
  reason: EliminatedReason;
  reasonLabel: string;
}

const REASON_LABELS: Record<EliminatedReason, string> = {
  fourth: '小组第四',
  early: '0 分提前出局',
  'third-missed': '第三名未进 +8',
  r32: '32 强淘汰',
};

function findTeamMeta(teamName: string) {
  for (const [letter, teams] of Object.entries(GROUPS) as [GroupLetter, Team[]][]) {
    const idx = teams.findIndex((t) => t.name === teamName);
    if (idx >= 0) {
      return {
        group: letter,
        rank: idx + 1,
        fifa: teams[idx].fifa,
        pts: teams[idx].pts,
        gd: getGoalDiff(teamName, letter),
      };
    }
  }
  return null;
}

export function getEliminatedTeams(): EliminatedTeam[] {
  const top8Third = new Set(
    getThirdPlaceCandidates()
      .filter((c) => c.inTop8)
      .map((c) => c.team),
  );

  const result: EliminatedTeam[] = [];
  const seen = new Set<string>();

  (Object.entries(GROUPS) as [GroupLetter, Team[]][]).forEach(([letter, teams]) => {
    teams.forEach((team, index) => {
      if (!isTeamEliminated(team, letter, index)) return;

      const reason: EliminatedReason = index === 3 ? 'fourth' : 'early';
      result.push({
        team: team.name,
        group: letter,
        rank: index + 1,
        fifa: team.fifa,
        pts: team.pts,
        gd: getGoalDiff(team.name, letter),
        reason,
        reasonLabel: REASON_LABELS[reason],
      });
      seen.add(team.name);
    });

    if (isGroupComplete(letter)) {
      const third = teams[2];
      if (third && !top8Third.has(third.name) && !seen.has(third.name)) {
        result.push({
          team: third.name,
          group: letter,
          rank: 3,
          fifa: third.fifa,
          pts: third.pts,
          gd: getGoalDiff(third.name, letter),
          reason: 'third-missed',
          reasonLabel: REASON_LABELS['third-missed'],
        });
        seen.add(third.name);
      }
    }
  });

  ROUND_OF_32_FINAL.forEach((m) => {
    if (!m.played || !m.winner) return;
    const loser = m.winner === m.home ? m.away : m.home;
    if (seen.has(loser)) return;
    const meta = findTeamMeta(loser);
    if (!meta) return;
    result.push({
      team: loser,
      group: meta.group,
      rank: meta.rank,
      fifa: meta.fifa,
      pts: meta.pts,
      gd: meta.gd,
      reason: 'r32',
      reasonLabel: REASON_LABELS.r32,
    });
    seen.add(loser);
  });

  return result.sort(
    (a, b) => a.group.localeCompare(b.group) || a.rank - b.rank,
  );
}
