export interface Team {
  name: string;
  fifa: number;
  pts: number;
}

export interface Fixture {
  home: string;
  away: string;
  date: string;
  md: number;
  played: boolean;
  score?: string;
}

export type GroupLetter =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L';

export const MAX_PTS = 6;

export const GROUPS: Record<GroupLetter, Team[]> = {
  A: [
    { name: '墨西哥', fifa: 11, pts: 6 },
    { name: '韩国', fifa: 23, pts: 3 },
    { name: '捷克', fifa: 44, pts: 1 },
    { name: '南非', fifa: 60, pts: 1 },
  ],
  B: [
    { name: '加拿大', fifa: 28, pts: 4 },
    { name: '瑞士', fifa: 18, pts: 4 },
    { name: '波黑', fifa: 64, pts: 1 },
    { name: '卡塔尔', fifa: 56, pts: 1 },
  ],
  C: [
    { name: '巴西', fifa: 5, pts: 4 },
    { name: '摩洛哥', fifa: 6, pts: 4 },
    { name: '苏格兰', fifa: 41, pts: 3 },
    { name: '海地', fifa: 83, pts: 0 },
  ],
  D: [
    { name: '美国', fifa: 13, pts: 6 },
    { name: '澳大利亚', fifa: 25, pts: 3 },
    { name: '巴拉圭', fifa: 37, pts: 3 },
    { name: '土耳其', fifa: 32, pts: 0 },
  ],
  E: [
    { name: '德国', fifa: 8, pts: 6 },
    { name: '科特迪瓦', fifa: 31, pts: 3 },
    { name: '厄瓜多尔', fifa: 30, pts: 1 },
    { name: '库拉索', fifa: 82, pts: 1 },
  ],
  F: [
    { name: '荷兰', fifa: 7, pts: 4 },
    { name: '日本', fifa: 16, pts: 4 },
    { name: '瑞典', fifa: 36, pts: 3 },
    { name: '突尼斯', fifa: 45, pts: 0 },
  ],
  G: [
    { name: '埃及', fifa: 26, pts: 4 },
    { name: '伊朗', fifa: 22, pts: 2 },
    { name: '比利时', fifa: 10, pts: 2 },
    { name: '新西兰', fifa: 85, pts: 1 },
  ],
  H: [
    { name: '西班牙', fifa: 3, pts: 4 },
    { name: '乌拉圭', fifa: 19, pts: 2 },
    { name: '佛得角', fifa: 67, pts: 2 },
    { name: '沙特阿拉伯', fifa: 61, pts: 1 },
  ],
  I: [
    { name: '法国', fifa: 2, pts: 6 },
    { name: '挪威', fifa: 27, pts: 6 },
    { name: '塞内加尔', fifa: 17, pts: 0 },
    { name: '伊拉克', fifa: 57, pts: 0 },
  ],
  J: [
    { name: '阿根廷', fifa: 1, pts: 6 },
    { name: '奥地利', fifa: 21, pts: 3 },
    { name: '阿尔及利亚', fifa: 29, pts: 3 },
    { name: '约旦', fifa: 63, pts: 0 },
  ],
  K: [
    { name: '哥伦比亚', fifa: 12, pts: 3 },
    { name: '民主刚果', fifa: 43, pts: 1 },
    { name: '葡萄牙', fifa: 9, pts: 1 },
    { name: '乌兹别克斯坦', fifa: 50, pts: 0 },
  ],
  L: [
    { name: '英格兰', fifa: 4, pts: 3 },
    { name: '加纳', fifa: 73, pts: 3 },
    { name: '巴拿马', fifa: 40, pts: 0 },
    { name: '克罗地亚', fifa: 15, pts: 0 },
  ],
};

export const FIXTURES: Record<GroupLetter, Fixture[]> = {
  A: [
    { home: '墨西哥', away: '南非', date: '06-11', md: 1, played: true, score: '2-0' },
    { home: '韩国', away: '捷克', date: '06-11', md: 1, played: true, score: '2-1' },
    { home: '捷克', away: '南非', date: '06-18', md: 2, played: true, score: '1-1' },
    { home: '墨西哥', away: '韩国', date: '06-19', md: 2, played: true, score: '1-0' },
    { home: '捷克', away: '墨西哥', date: '06-24', md: 3, played: false },
    { home: '南非', away: '韩国', date: '06-24', md: 3, played: false },
  ],
  B: [
    { home: '加拿大', away: '波黑', date: '06-12', md: 1, played: true, score: '1-1' },
    { home: '卡塔尔', away: '瑞士', date: '06-13', md: 1, played: true, score: '1-1' },
    { home: '瑞士', away: '波黑', date: '06-18', md: 2, played: true, score: '4-1' },
    { home: '加拿大', away: '卡塔尔', date: '06-18', md: 2, played: true, score: '6-0' },
    { home: '瑞士', away: '加拿大', date: '06-24', md: 3, played: false },
    { home: '波黑', away: '卡塔尔', date: '06-24', md: 3, played: false },
  ],
  C: [
    { home: '巴西', away: '摩洛哥', date: '06-14', md: 1, played: true, score: '1-1' },
    { home: '海地', away: '苏格兰', date: '06-14', md: 1, played: true, score: '0-1' },
    { home: '苏格兰', away: '摩洛哥', date: '06-20', md: 2, played: true, score: '0-1' },
    { home: '巴西', away: '海地', date: '06-20', md: 2, played: true, score: '3-0' },
    { home: '苏格兰', away: '巴西', date: '06-24', md: 3, played: false },
    { home: '摩洛哥', away: '海地', date: '06-24', md: 3, played: false },
  ],
  D: [
    { home: '美国', away: '巴拉圭', date: '06-12', md: 1, played: true, score: '4-1' },
    { home: '澳大利亚', away: '土耳其', date: '06-13', md: 1, played: true, score: '2-0' },
    { home: '美国', away: '澳大利亚', date: '06-19', md: 2, played: true, score: '2-0' },
    { home: '土耳其', away: '巴拉圭', date: '06-19', md: 2, played: true, score: '0-1' },
    { home: '土耳其', away: '美国', date: '06-25', md: 3, played: false },
    { home: '巴拉圭', away: '澳大利亚', date: '06-25', md: 3, played: false },
  ],
  E: [
    { home: '德国', away: '库拉索', date: '06-14', md: 1, played: true, score: '7-1' },
    { home: '科特迪瓦', away: '厄瓜多尔', date: '06-15', md: 1, played: true, score: '1-0' },
    { home: '德国', away: '科特迪瓦', date: '06-20', md: 2, played: true, score: '2-1' },
    { home: '厄瓜多尔', away: '库拉索', date: '06-21', md: 2, played: true, score: '0-0' },
    { home: '库拉索', away: '科特迪瓦', date: '06-25', md: 3, played: false },
    { home: '厄瓜多尔', away: '德国', date: '06-25', md: 3, played: false },
  ],
  F: [
    { home: '荷兰', away: '日本', date: '06-14', md: 1, played: true, score: '2-2' },
    { home: '瑞典', away: '突尼斯', date: '06-15', md: 1, played: true, score: '5-1' },
    { home: '荷兰', away: '瑞典', date: '06-20', md: 2, played: true, score: '5-1' },
    { home: '突尼斯', away: '日本', date: '06-21', md: 2, played: true, score: '0-4' },
    { home: '日本', away: '瑞典', date: '06-25', md: 3, played: false },
    { home: '突尼斯', away: '荷兰', date: '06-25', md: 3, played: false },
  ],
  G: [
    { home: '比利时', away: '埃及', date: '06-15', md: 1, played: true, score: '1-1' },
    { home: '伊朗', away: '新西兰', date: '06-15', md: 1, played: true, score: '2-2' },
    { home: '比利时', away: '伊朗', date: '06-21', md: 2, played: true, score: '0-0' },
    { home: '新西兰', away: '埃及', date: '06-21', md: 2, played: true, score: '1-3' },
    { home: '埃及', away: '伊朗', date: '06-26', md: 3, played: false },
    { home: '新西兰', away: '比利时', date: '06-26', md: 3, played: false },
  ],
  H: [
    { home: '西班牙', away: '佛得角', date: '06-15', md: 1, played: true, score: '0-0' },
    { home: '沙特阿拉伯', away: '乌拉圭', date: '06-15', md: 1, played: true, score: '1-1' },
    { home: '西班牙', away: '沙特阿拉伯', date: '06-21', md: 2, played: true, score: '4-0' },
    { home: '乌拉圭', away: '佛得角', date: '06-22', md: 2, played: true, score: '2-2' },
    { home: '佛得角', away: '沙特阿拉伯', date: '06-26', md: 3, played: false },
    { home: '乌拉圭', away: '西班牙', date: '06-26', md: 3, played: false },
  ],
  I: [
    { home: '法国', away: '塞内加尔', date: '06-16', md: 1, played: true, score: '3-1' },
    { home: '伊拉克', away: '挪威', date: '06-16', md: 1, played: true, score: '1-4' },
    { home: '法国', away: '伊拉克', date: '06-22', md: 2, played: true, score: '3-0' },
    { home: '挪威', away: '塞内加尔', date: '06-22', md: 2, played: true, score: '3-2' },
    { home: '挪威', away: '法国', date: '06-26', md: 3, played: false },
    { home: '塞内加尔', away: '伊拉克', date: '06-26', md: 3, played: false },
  ],
  J: [
    { home: '阿根廷', away: '阿尔及利亚', date: '06-16', md: 1, played: true, score: '3-0' },
    { home: '奥地利', away: '约旦', date: '06-16', md: 1, played: true, score: '3-1' },
    { home: '阿根廷', away: '奥地利', date: '06-22', md: 2, played: true, score: '2-0' },
    { home: '约旦', away: '阿尔及利亚', date: '06-22', md: 2, played: true, score: '1-2' },
    { home: '阿尔及利亚', away: '奥地利', date: '06-27', md: 3, played: false },
    { home: '约旦', away: '阿根廷', date: '06-27', md: 3, played: false },
  ],
  K: [
    { home: '葡萄牙', away: '民主刚果', date: '06-17', md: 1, played: true, score: '1-1' },
    { home: '乌兹别克斯坦', away: '哥伦比亚', date: '06-17', md: 1, played: true, score: '1-3' },
    { home: '葡萄牙', away: '乌兹别克斯坦', date: '06-23', md: 2, played: false },
    { home: '哥伦比亚', away: '民主刚果', date: '06-23', md: 2, played: false },
    { home: '哥伦比亚', away: '葡萄牙', date: '06-27', md: 3, played: false },
    { home: '民主刚果', away: '乌兹别克斯坦', date: '06-27', md: 3, played: false },
  ],
  L: [
    { home: '英格兰', away: '克罗地亚', date: '06-17', md: 1, played: true, score: '4-2' },
    { home: '加纳', away: '巴拿马', date: '06-17', md: 1, played: true, score: '1-0' },
    { home: '英格兰', away: '加纳', date: '06-23', md: 2, played: false },
    { home: '巴拿马', away: '克罗地亚', date: '06-23', md: 2, played: false },
    { home: '巴拿马', away: '英格兰', date: '06-27', md: 3, played: false },
    { home: '克罗地亚', away: '加纳', date: '06-27', md: 3, played: false },
  ],
};
