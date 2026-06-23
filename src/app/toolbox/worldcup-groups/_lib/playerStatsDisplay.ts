import type { PlayerStats } from '../_data/playerStats';
import { PLAYER_STATS } from '../_data/playerStats';

const FALLBACK: PlayerStats = { age: 27, value: 0.8, rating: 71 };

/** 获取球员年龄、身价、EA FC 能力值 */
export function getPlayerStats(name: string): PlayerStats {
  return PLAYER_STATS[name] ?? FALLBACK;
}

/** 格式化身价（百万欧元 → 万欧/亿欧） */
export function formatPlayerValue(millionEur: number): string {
  if (millionEur >= 100) {
    const yi = Math.round((millionEur / 100) * 10) / 10;
    return `${yi}亿欧`;
  }
  const wan = Math.round(millionEur * 100);
  return `${wan}万欧`;
}

/** 排序权重：转会估值与能力值折合成「综合身价」，避免高龄球星因市场估值偏低排太后 */
function sortWeight(stats: PlayerStats): number {
  return Math.max(stats.value, stats.rating * 0.75);
}

/** 按综合身价降序排列（同档按能力值） */
export function sortPlayersByValue<T extends { name: string }>(players: T[]): T[] {
  return [...players].sort((a, b) => {
    const sa = getPlayerStats(a.name);
    const sb = getPlayerStats(b.name);
    const wa = sortWeight(sa);
    const wb = sortWeight(sb);
    if (wb !== wa) return wb - wa;
    return sb.rating - sa.rating;
  });
}

/** 阵容汇总：总身价（百万欧元）、平均年龄 */
export function summarizeLineup(players: { name: string }[]) {
  const seen = new Set<string>();
  let totalValue = 0;
  let totalAge = 0;
  let count = 0;

  for (const p of players) {
    if (seen.has(p.name)) continue;
    seen.add(p.name);
    const s = getPlayerStats(p.name);
    totalValue += s.value;
    totalAge += s.age;
    count += 1;
  }

  return {
    totalValue,
    avgAge: count ? Math.round((totalAge / count) * 10) / 10 : 0,
  };
}

/** 能力值颜色等级 */
export function ratingTier(rating: number): 'elite' | 'strong' | 'mid' | 'low' {
  if (rating >= 85) return 'elite';
  if (rating >= 80) return 'strong';
  if (rating >= 75) return 'mid';
  return 'low';
}
