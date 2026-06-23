import { GROUPS, type GroupLetter } from '../_data';
import { getGoalDiff, getGoalsFor, getTeamMatches } from './matches';

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
}

const NOTES: Partial<Record<string, string>> = {
  瑞典: '末轮对日本，即使列第三也凭进 6 球占优',
  韩国: '若末轮负南非将列第三',
  苏格兰: '进球偏少，同分第三名中处劣势',
  巴拉圭: '末轮对澳大利亚，输家进 +8 池',
  澳大利亚: '末轮对巴拉圭，输家进 +8 池',
  比利时: 'G 组末轮乱战，有机会以 4 分列第三',
  伊朗: 'G 组末轮对埃及，有机会升第三',
  佛得角: 'H 组形势未明，末轮对沙特',
  乌拉圭: 'H 组末轮对西班牙争分',
  捷克: 'A 组第三名候选，积分偏低',
  厄瓜多尔: '1 分且 0 进球，希望渺茫',
  波黑: 'B 组第三名，最多 4 分',
  葡萄牙: 'K 组仅赛 1 轮，形势未定',
  塞内加尔: 'I 组前二已 6 分，第三名最多 3 分',
  约旦: '已赛 2 场 0 分出局',
  阿尔及利亚: 'J 组第三名，3 分净胜 -2',
  巴拿马: 'L 组仅赛 1 轮，目前 0 分',
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

    raw.push({
      team: third.name,
      group: letter,
      pts: third.pts,
      gd: third.gd,
      gf: third.gf,
      note: NOTES[third.name] ?? `${letter} 组当前第三名`,
    });

    const second = sorted[1];
    if (second.pts === third.pts && second.name !== third.name && !isLockedTopTwo(second.name, letter, sorted)) {
      raw.push({
        team: second.name,
        group: letter,
        pts: second.pts,
        gd: second.gd,
        gf: second.gf,
        note: NOTES[second.name] ?? '争小组第二，若落第三则进 +8 池',
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
  return getThirdPlaceCandidates().filter((c) => c.tier !== 'unlikely' || c.inTop8);
}
