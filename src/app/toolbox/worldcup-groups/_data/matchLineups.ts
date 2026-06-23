import type { GroupLetter } from './index';
import type { MatchLineupPreview } from './lineupTypes';
import { getTeamLineup } from './teamLineups';

const MATCH_NOTES: Record<string, string> = {
  'A-R3-捷克-vs-墨西哥': '捷克末轮争胜，墨西哥或轮换',
  'A-R3-南非-vs-韩国': '韩国需取胜才稳进前二；OPTA 预测 3-4-2-1',
  'B-R3-瑞士-vs-加拿大': '头名之争，胜者小组第一',
  'D-R3-巴拉圭-vs-澳大利亚': '直接对话，输家进 +8 池',
  'F-R3-日本-vs-瑞典': '头名与 +8 形势关键战',
  'G-R3-埃及-vs-伊朗': 'G 组出线形势最复杂场次之一',
  'H-R3-乌拉圭-vs-西班牙': '乌拉圭需分争出线',
  'I-R3-挪威-vs-法国': '头名之战，两队均已出线',
  'J-R3-阿尔及利亚-vs-奥地利': '阿尔及利亚取胜可争第二',
  'K-R2-葡萄牙-vs-乌兹别克斯坦': '葡萄牙必须抢分',
  'K-R2-哥伦比亚-vs-民主刚果': '哥伦比亚取胜占主动',
  'L-R2-英格兰-vs-加纳': 'L 组头名之争',
  'L-R2-巴拿马-vs-克罗地亚': '克罗地亚背水一战',
};

export function getMatchLineupPreview(
  group: GroupLetter,
  home: string,
  away: string,
  md: number,
): MatchLineupPreview | null {
  const homeLineup = getTeamLineup(home);
  const awayLineup = getTeamLineup(away);
  if (!homeLineup || !awayLineup) return null;

  const matchKey = `${group}-R${md}-${home}-vs-${away}`;
  return {
    matchKey,
    group,
    home,
    away,
    date: '',
    md,
    homeLineup,
    awayLineup,
    previewNote: MATCH_NOTES[matchKey],
  };
}

export function enrichMatchPreview(
  preview: MatchLineupPreview,
  date: string,
): MatchLineupPreview {
  return { ...preview, date };
}
