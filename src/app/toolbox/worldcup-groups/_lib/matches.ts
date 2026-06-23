import { FIXTURES, type GroupLetter } from '../_data';

export type MatchOutcome = 'win' | 'draw' | 'loss';

export interface PlayedTeamMatch {
  opponent: string;
  venue: string;
  date: string;
  md: number;
  played: true;
  outcome: MatchOutcome;
  score: string;
}

export interface UpcomingTeamMatch {
  opponent: string;
  venue: string;
  date: string;
  md: number;
  played: false;
}

export type TeamMatch = PlayedTeamMatch | UpcomingTeamMatch;

function parseScore(score: string) {
  const [h, a] = score.split('-').map(Number);
  return { h, a };
}

export function getTeamMatches(
  teamName: string,
  groupLetter: GroupLetter,
): TeamMatch[] {
  return FIXTURES[groupLetter]
    .filter((m) => m.home === teamName || m.away === teamName)
    .sort((a, b) => a.md - b.md)
    .map((m) => {
      const isHome = m.home === teamName;
      const opponent = isHome ? m.away : m.home;
      const venue = isHome ? '主' : '客';

      if (!m.played || !m.score) {
        return { opponent, venue, date: m.date, md: m.md, played: false as const };
      }

      const { h, a } = parseScore(m.score);
      const gf = isHome ? h : a;
      const ga = isHome ? a : h;
      let outcome: MatchOutcome = 'draw';
      if (gf > ga) outcome = 'win';
      else if (gf < ga) outcome = 'loss';

      return {
        opponent,
        venue,
        date: m.date,
        md: m.md,
        played: true as const,
        outcome,
        score: `${gf}-${ga}`,
      };
    });
}

export function getGoalsFor(teamName: string, groupLetter: GroupLetter) {
  let gf = 0;
  getTeamMatches(teamName, groupLetter).forEach((m) => {
    if (!m.played) return;
    gf += Number(m.score.split('-')[0]);
  });
  return gf;
}

export function getGoalDiff(teamName: string, groupLetter: GroupLetter) {
  let gf = 0;
  let ga = 0;
  getTeamMatches(teamName, groupLetter).forEach((m) => {
    if (!m.played) return;
    const [scored, conceded] = m.score.split('-').map(Number);
    gf += scored;
    ga += conceded;
  });
  return gf - ga;
}

export function formatGd(gd: number) {
  if (gd > 0) return `+${gd}`;
  return `${gd}`;
}

export function gdClass(gd: number) {
  if (gd > 0) return 'positive';
  if (gd < 0) return 'negative';
  return 'zero';
}

export function outcomeLabel(outcome: MatchOutcome) {
  if (outcome === 'win') return '胜';
  if (outcome === 'loss') return '负';
  return '平';
}
