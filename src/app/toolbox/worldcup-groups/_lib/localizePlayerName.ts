import { PLAYER_NAME_ZH } from '../_data/playerNameZh';

const HAS_CJK = /[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/;

/** 将阵容中的外文球员名转为中文译名；已是中文/日文/韩文则原样返回 */
export function localizePlayerName(name: string): string {
  if (HAS_CJK.test(name)) return name;
  return PLAYER_NAME_ZH[name] ?? name;
}
