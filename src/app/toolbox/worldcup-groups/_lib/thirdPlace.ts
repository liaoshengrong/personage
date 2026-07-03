import { GROUPS, type GroupLetter } from '../_data';
import { getGoalDiff, getGoalsFor, getTeamMatches, isGroupComplete } from './matches';

export type ThirdPlaceTier = 'high' | 'medium' | 'low' | 'unlikely';

export interface ThirdPlaceCandidate {
  rank: number;
  team: string;
  group: GroupLetter;
  pts: number;
  gd: number;
  gf: number;
  tier: ThirdPlaceTier;
  note: string;
  inTop8: boolean;
  /** 该组小组赛已全部结束，第三名数据已锁定 */
  groupFinished: boolean;
}

const NOTES: Partial<Record<string, string>> = {
  厄瓜多尔: 'E 组第三 · 4 分 · 爆冷胜德国 · M79 对墨西哥',
  瑞典: 'F 组第三 · 4 分 · 进 7 球 · M77 对法国',
  民主刚果: 'K 组第三 · 4 分 · M80 对英格兰',
  加纳: 'L 组第三 · 4 分 · M87 对哥伦比亚',
  波黑: 'B 组第三 · 4 分 · M81 对美国',
  阿尔及利亚: 'J 组第三 · 4 分 · M85 对瑞士',
  巴拉圭: 'D 组第三 · 4 分 · M74 对德国',
  塞内加尔: 'I 组第三 · 3 分 · 净胜 +2 · M82 对比利时',
  韩国: 'A 组第三 · 3 分 · 未进 +8',
  伊朗: 'G 组第三 · 3 分 · 未进 +8',
  苏格兰: 'C 组第三 · 3 分 · 未进 +8',
  乌拉圭: 'H 组第三 · 2 分 · 未进 +8',
};

function tierFromRank(rank: number, pts: number): ThirdPlaceTier {
  if (pts === 0 && rank > 8) return 'unlikely';
  if (rank <= 3) return 'high';
  if (rank <= 6) return 'medium';
  if (rank <= 8) return 'medium';
  if (rank <= 10) return 'low';
  return 'unlikely';
}

function tierLabel(tier: ThirdPlaceTier) {
  if (tier === 'high') return '希望较大';
  if (tier === 'medium') return '有机会';
  if (tier === 'low') return '较困难';
  return '希望渺茫';
}

export { tierLabel };

function getGroupSorted(letter: GroupLetter) {
  return GROUPS[letter]
    .map((team) => ({
      name: team.name,
      fifa: team.fifa,
      pts: team.pts,
      gd: getGoalDiff(team.name, letter),
      gf: getGoalsFor(team.name, letter),
    }))
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
}

function isLockedTopTwo(teamName: string, letter: GroupLetter, sorted: ReturnType<typeof getGroupSorted>) {
  const index = sorted.findIndex((t) => t.name === teamName);
  if (index > 1) return false;
  const played = getTeamMatches(teamName, letter).filter((m) => m.played).length;
  const pts = sorted[index].pts;
  const thirdPts = sorted[2]?.pts ?? 0;
  const maxThirdCanReach = thirdPts + (3 - played) * 3;
  return index <= 1 && pts > maxThirdCanReach;
}

export function getThirdPlaceCandidates(): ThirdPlaceCandidate[] {
  const raw: Omit<ThirdPlaceCandidate, 'rank' | 'tier' | 'inTop8'>[] = [];

  (Object.keys(GROUPS) as GroupLetter[]).forEach((letter) => {
    const sorted = getGroupSorted(letter);
    const third = sorted[2];
    if (!third) return;

    const groupFinished = isGroupComplete(letter);

    raw.push({
      team: third.name,
      group: letter,
      pts: third.pts,
      gd: third.gd,
      gf: third.gf,
      note: NOTES[third.name] ?? `${letter} 组当前第三名`,
      groupFinished,
    });

    const second = sorted[1];
    // 仅小组未收官、且第二第三同分时，才把第二名纳入 +8 竞争观察
    if (
      !groupFinished &&
      second.pts === third.pts &&
      second.name !== third.name &&
      !isLockedTopTwo(second.name, letter, sorted)
    ) {
      raw.push({
        team: second.name,
        group: letter,
        pts: second.pts,
        gd: second.gd,
        gf: second.gf,
        note: NOTES[second.name] ?? '争小组第二，若落第三则进 +8 池',
        groupFinished: false,
      });
    }
  });

  raw.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);

  return raw.map((item, i) => {
    const rank = i + 1;
    return {
      ...item,
      rank,
      tier: tierFromRank(rank, item.pts),
      inTop8: rank <= 8,
    };
  });
}

export function getHopefulCandidates() {
  return getThirdPlaceCandidates();
}
