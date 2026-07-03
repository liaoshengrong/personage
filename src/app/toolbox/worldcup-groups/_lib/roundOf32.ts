import { ROUND_OF_32_FINAL } from '../_data/roundOf32';

export interface ResolvedRoundOf32Match {
  matchNo: number;
  date: string;
  time: string;
  venue: string;
  city: string;
  home: string;
  away: string;
  qualLabel: string;
  played: boolean;
  score?: string;
  scoreNote?: string;
  winner?: string;
}

export function getRoundOf32Matches(): ResolvedRoundOf32Match[] {
  return ROUND_OF_32_FINAL;
}

export function getConfirmedRoundOf32Matches() {
  return getRoundOf32Matches();
}
