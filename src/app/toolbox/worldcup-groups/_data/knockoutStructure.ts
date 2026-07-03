/** FIFA 2026 淘汰赛固定晋级路径（Match 73–104） */
export type KnockoutRound = 'r32' | 'r16' | 'qf' | 'sf' | 'final' | 'third';

export interface KnockoutSlotRef {
  matchNo: number;
  side: 'home' | 'away';
}

export interface KnockoutRoundMatchDef {
  matchNo: number;
  round: KnockoutRound;
  date: string;
  home: KnockoutSlotRef | 'team';
  away: KnockoutSlotRef | 'team';
}

/** 32 强在晋级树中的自上而下顺序（用于对齐连线） */
export const R32_BRACKET_ORDER = [
  74, 77, 73, 75, 83, 84, 81, 82, 76, 78, 79, 80, 86, 88, 85, 87,
] as const;

export const R16_BRACKET_ORDER = [89, 90, 93, 94, 91, 92, 95, 96] as const;

export const QF_BRACKET_ORDER = [97, 98, 99, 100] as const;

export const SF_BRACKET_ORDER = [101, 102] as const;

/** 16 强及之后：胜者来自哪两场 32 强/上一轮 */
export const KNOCKOUT_FEED: Record<
  number,
  { round: KnockoutRound; date: string; home: number | 'l101'; away: number | 'l102' }
> = {
  89: { round: 'r16', date: '07-04', home: 74, away: 77 },
  90: { round: 'r16', date: '07-04', home: 73, away: 75 },
  91: { round: 'r16', date: '07-05', home: 76, away: 78 },
  92: { round: 'r16', date: '07-05', home: 79, away: 80 },
  93: { round: 'r16', date: '07-06', home: 83, away: 84 },
  94: { round: 'r16', date: '07-06', home: 81, away: 82 },
  95: { round: 'r16', date: '07-07', home: 86, away: 88 },
  96: { round: 'r16', date: '07-07', home: 85, away: 87 },
  97: { round: 'qf', date: '07-09', home: 89, away: 90 },
  98: { round: 'qf', date: '07-10', home: 93, away: 94 },
  99: { round: 'qf', date: '07-11', home: 91, away: 92 },
  100: { round: 'qf', date: '07-11', home: 95, away: 96 },
  101: { round: 'sf', date: '07-14', home: 97, away: 98 },
  102: { round: 'sf', date: '07-15', home: 99, away: 100 },
  103: { round: 'third', date: '07-18', home: 'l101', away: 'l102' },
  104: { round: 'final', date: '07-19', home: 101, away: 102 },
};

export const ROUND_LABELS: Record<KnockoutRound, string> = {
  r32: '32 强',
  r16: '16 强',
  qf: '8 强',
  sf: '半决赛',
  final: '决赛',
  third: '季军战',
};
