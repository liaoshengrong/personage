import type { BracketRound } from 'bracketkit';
import { GROUPS } from '../_data';
import { ROUND_OF_32_FINAL } from '../_data/roundOf32';
import {
  KNOCKOUT_FEED,
  QF_BRACKET_ORDER,
  R16_BRACKET_ORDER,
  R32_BRACKET_ORDER,
  ROUND_LABELS,
  SF_BRACKET_ORDER,
  type KnockoutRound,
} from '../_data/knockoutStructure';

export interface ResolvedKnockoutMatch {
  matchNo: number;
  round: KnockoutRound;
  roundLabel: string;
  date: string;
  home: string;
  away: string;
  winner: string;
  loser: string;
  homeFifa: number;
  awayFifa: number;
}

export interface ResolvedBracket {
  matches: Map<number, ResolvedKnockoutMatch>;
  champion: string;
  runnerUp: string;
  thirdPlace: string;
  fourthPlace: string;
}

function buildFifaRankMap(): Record<string, number> {
  const map: Record<string, number> = {};
  Object.values(GROUPS)
    .flat()
    .forEach((t) => {
      map[t.name] = t.fifa;
    });
  return map;
}

const FIFA_RANK = buildFifaRankMap();

function getFifa(team: string) {
  return FIFA_RANK[team] ?? 999;
}

/** 默认强队胜：FIFA 排名数字更小者晋级 */
export function pickStrongerTeam(home: string, away: string): string {
  const homeRank = getFifa(home);
  const awayRank = getFifa(away);
  if (homeRank === awayRank) return home;
  return homeRank < awayRank ? home : away;
}

function resolveR32(): Map<number, ResolvedKnockoutMatch> {
  const map = new Map<number, ResolvedKnockoutMatch>();

  ROUND_OF_32_FINAL.forEach((m) => {
    const winner =
      m.played && m.winner ? m.winner : pickStrongerTeam(m.home, m.away);
    map.set(m.matchNo, {
      matchNo: m.matchNo,
      round: 'r32',
      roundLabel: ROUND_LABELS.r32,
      date: m.date,
      home: m.home,
      away: m.away,
      winner,
      loser: winner === m.home ? m.away : m.home,
      homeFifa: getFifa(m.home),
      awayFifa: getFifa(m.away),
    });
  });

  return map;
}

function teamFromRef(
  ref: number | 'l101' | 'l102',
  winners: Map<number, string>,
  losers: Map<number, string>,
): string {
  if (ref === 'l101') return losers.get(101) ?? '待定';
  if (ref === 'l102') return losers.get(102) ?? '待定';
  return winners.get(ref) ?? '待定';
}

export function resolveKnockoutBracket(): ResolvedBracket {
  const matches = resolveR32();
  const winners = new Map<number, string>();
  const losers = new Map<number, string>();

  matches.forEach((m) => {
    winners.set(m.matchNo, m.winner);
    losers.set(m.matchNo, m.loser);
  });

  const ordered = [
    ...R16_BRACKET_ORDER,
    ...QF_BRACKET_ORDER,
    ...SF_BRACKET_ORDER,
    103,
    104,
  ];

  ordered.forEach((matchNo) => {
    const def = KNOCKOUT_FEED[matchNo];
    const home = teamFromRef(def.home, winners, losers);
    const away = teamFromRef(def.away, winners, losers);
    const winner = pickStrongerTeam(home, away);

    const resolved: ResolvedKnockoutMatch = {
      matchNo,
      round: def.round,
      roundLabel: ROUND_LABELS[def.round],
      date: def.date,
      home,
      away,
      winner,
      loser: winner === home ? away : home,
      homeFifa: getFifa(home),
      awayFifa: getFifa(away),
    };

    matches.set(matchNo, resolved);
    winners.set(matchNo, winner);
    losers.set(matchNo, resolved.loser);
  });

  const final = matches.get(104)!;
  const third = matches.get(103)!;

  return {
    matches,
    champion: final.winner,
    runnerUp: final.loser,
    thirdPlace: third.winner,
    fourthPlace: third.loser,
  };
}

export function getBracketRoundMatches(
  bracket: ResolvedBracket,
  round: KnockoutRound,
  order?: readonly number[],
) {
  const nums =
    order ??
    (round === 'r32'
      ? R32_BRACKET_ORDER
      : round === 'r16'
        ? R16_BRACKET_ORDER
        : round === 'qf'
          ? QF_BRACKET_ORDER
          : round === 'sf'
            ? SF_BRACKET_ORDER
            : round === 'final'
              ? [104]
              : [103]);

  return nums.map((n) => bracket.matches.get(n)!);
}

export interface BracketKitMatch {
  id: string;
  matchNo: number;
  date: string;
  home: string;
  away: string;
  homeFifa: number;
  awayFifa: number;
  winner: string;
}

function toBracketKitMatch(m: ResolvedKnockoutMatch): BracketKitMatch {
  return {
    id: `m${m.matchNo}`,
    matchNo: m.matchNo,
    date: m.date,
    home: m.home,
    away: m.away,
    homeFifa: m.homeFifa,
    awayFifa: m.awayFifa,
    winner: m.winner,
  };
}

/** 转为 bracketkit 组件所需轮次数据（按官方晋级树顺序） */
export function buildBracketKitRounds(
  bracket: ResolvedBracket,
): BracketRound<BracketKitMatch>[] {
  return [
    {
      id: 'r32',
      name: '32 强',
      matches: getBracketRoundMatches(bracket, 'r32').map(toBracketKitMatch),
    },
    {
      id: 'r16',
      name: '16 强',
      matches: getBracketRoundMatches(bracket, 'r16').map(toBracketKitMatch),
    },
    {
      id: 'qf',
      name: '8 强',
      matches: getBracketRoundMatches(bracket, 'qf').map(toBracketKitMatch),
    },
    {
      id: 'sf',
      name: '半决赛',
      matches: getBracketRoundMatches(bracket, 'sf').map(toBracketKitMatch),
    },
    {
      id: 'final',
      name: '决赛',
      matches: getBracketRoundMatches(bracket, 'final').map(toBracketKitMatch),
    },
  ];
}
