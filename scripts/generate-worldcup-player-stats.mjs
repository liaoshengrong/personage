#!/usr/bin/env node
/**
 * 离线生成球员年龄/能力值/身价（EA FC 25 + Transfermarkt 参考）
 * 运行: node scripts/generate-worldcup-player-stats.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const LINEUPS_PATH = path.join(
  ROOT,
  'src/app/toolbox/worldcup-groups/_data/teamLineups.ts',
);
const INDEX_PATH = path.join(
  ROOT,
  'src/app/toolbox/worldcup-groups/_data/index.ts',
);
const OUT_PATH = path.join(
  ROOT,
  'src/app/toolbox/worldcup-groups/_data/playerStats.ts',
);

/** age, rating, value(M€) — 2026 世界杯语境参考值 */
const OVERRIDES = {
  'Kylian Mbappé': [27, 91, 180],
  'Erling Haaland': [26, 91, 180],
  'Jude Bellingham': [23, 90, 150],
  'Harry Kane': [33, 90, 100],
  'Rodri': [30, 90, 80],
  'Kevin De Bruyne': [35, 90, 45],
  'Florian Wirtz': [23, 89, 130],
  'Mohamed Salah': [34, 89, 80],
  'Lamine Yamal': [19, 89, 120],
  'Virgil van Dijk': [35, 89, 25],
  'Alisson': [34, 89, 25],
  'Lautaro Martínez': [29, 89, 85],
  'Alexander Isak': [26, 89, 70],
  'Martin Ødegaard': [27, 89, 90],
  'Bruno Fernandes': [31, 88, 50],
  'Lionel Messi': [39, 88, 15],
  'Antoine Griezmann': [35, 88, 25],
  'Rafael Leão': [26, 88, 70],
  'Declan Rice': [27, 88, 90],
  'Ruben Neves': [28, 88, 40],
  'Bernardo Silva': [31, 88, 50],
  'Cristiano Ronaldo': [41, 88, 15],
  'Federico Valverde': [27, 88, 100],
  'Joshua Kimmich': [31, 88, 50],
  'Jamal Musiala': [23, 88, 110],
  'Phil Foden': [26, 88, 80],
  'Bukayo Saka': [24, 88, 100],
  'Rodrygo': [25, 87, 80],
  'Vinícius Júnior': [26, 87, 150],
  'Achraf Hakimi': [27, 87, 60],
  'Nico Williams': [23, 87, 70],
  'Pedri': [23, 87, 100],
  'Gavi': [21, 87, 90],
  'Marc Guéhi': [25, 87, 45],
  'William Saliba': [25, 87, 70],
  'Aurélien Tchouaméni': [26, 87, 80],
  'Enzo Fernández': [24, 87, 75],
  'Cody Gakpo': [27, 87, 45],
  'Darwin Núñez': [26, 87, 55],
  'Luis Díaz': [29, 87, 65],
  'James Rodríguez': [34, 87, 8],
  'Son Heung-min': [34, 87, 35],
  孙兴慜: [34, 87, 35],
  'Kim Min-jae': [29, 87, 45],
  金玟哉: [29, 87, 45],
  'Lee Kang-in': [24, 86, 35],
  李刚仁: [24, 86, 35],
  'Takefusa Kubo': [24, 86, 40],
  久保建英: [24, 86, 40],
  'Kaoru Mitoma': [28, 86, 50],
  三笘薰: [28, 86, 50],
  'Wataru Endo': [32, 86, 12],
  远藤航: [32, 86, 12],
  'Takehiro Tomiyasu': [27, 86, 25],
  富安健洋: [27, 86, 25],
  'Riyad Mahrez': [34, 86, 15],
  'Sadio Mané': [34, 86, 20],
  'Kalidou Koulibaly': [35, 86, 8],
  'Édouard Mendy': [34, 86, 10],
  'Thomas Müller': [36, 86, 12],
  'Manuel Neuer': [40, 86, 5],
  'Antonio Rüdiger': [32, 86, 20],
  'Jonathan Tah': [29, 86, 35],
  'Leroy Sané': [30, 86, 35],
  'Nicolas Pépé': [30, 86, 18],
  'Sebastien Haller': [31, 86, 15],
  'Moises Caicedo': [24, 86, 75],
  'Piero Hincapié': [24, 86, 45],
  'Pervis Estupiñán': [27, 86, 30],
  'Enner Valencia': [36, 86, 5],
  'Kendry Páez': [18, 86, 35],
  'Memphis Depay': [31, 86, 12],
  'Denzel Dumfries': [29, 86, 28],
  'Nathan Aké': [30, 86, 35],
  'Tijjani Reijnders': [27, 86, 45],
  'Dejan Kulusevski': [25, 86, 55],
  'Viktor Gyökeres': [27, 86, 65],
  'Emiliano Martínez': [33, 86, 25],
  'Alexis Mac Allister': [26, 86, 75],
  'Rodrigo De Paul': [31, 86, 25],
  'Cristian Romero': [27, 86, 55],
  'Marcel Sabitzer': [31, 86, 18],
  'David Alaba': [34, 86, 8],
  'Marko Arnautović': [37, 86, 4],
  'Ismaël Bennacer': [27, 86, 25],
  'Yerry Mina': [31, 86, 8],
  'Dávinson Sánchez': [29, 86, 18],
  'Jefferson Lerma': [31, 86, 15],
  'Wilmar Barrios': [31, 86, 12],
  'Rúben Dias': [28, 86, 60],
  'João Cancelo': [31, 86, 25],
  'Diogo Jota': [28, 86, 45],
  'Pepe': [43, 86, 1],
  'Nuno Mendes': [23, 86, 55],
  'John Stones': [31, 86, 28],
  'Kyle Walker': [35, 86, 10],
  'Thomas Partey': [32, 86, 18],
  'Mohammed Kudus': [25, 86, 45],
  'Luka Modric': [40, 86, 8],
  'Josko Gvardiol': [23, 86, 65],
  'Mateo Kovacic': [31, 86, 25],
  'Ivan Perisic': [36, 86, 5],
  Perisic: [36, 86, 5],
  'Edson Álvarez': [28, 85, 28],
  埃德森·阿尔瓦雷斯: [28, 85, 28],
  'Raúl Jiménez': [34, 85, 6],
  劳尔·希门尼斯: [34, 85, 6],
  'Patrik Schick': [29, 85, 22],
  帕特里克·希克: [29, 85, 22],
  'Pavel Souček': [30, 85, 18],
  帕维尔·绍切克: [30, 85, 18],
  'Tomáš Souček': [30, 85, 18],
  托马斯·索塞克: [30, 85, 18],
  'Alphonso Davies': [24, 85, 50],
  'Jonathan David': [25, 85, 35],
  'Granit Xhaka': [33, 85, 12],
  'Xherdan Shaqiri': [33, 85, 6],
  'Miralem Pjanic': [35, 85, 3],
  'Edin Dzeko': [39, 85, 2],
  'Akram Afif': [29, 85, 20],
  'Marquinhos': [31, 85, 35],
  'Bruno Guimarães': [27, 85, 65],
  'Richarlison': [28, 85, 25],
  'Raphinha': [28, 85, 45],
  'Yassine Bounou': [33, 85, 8],
  'Noussair Mazraoui': [27, 85, 25],
  'Scott McTominay': [28, 85, 35],
  'Andrew Robertson': [31, 85, 18],
  'Christian Pulisic': [27, 85, 45],
  'Weston McKennie': [27, 85, 22],
  'Miguel Almirón': [31, 85, 12],
  'Hakan Çalhanoğlu': [32, 85, 18],
  'Merih Demiral': [27, 85, 22],
  'Niclas Füllkrug': [32, 85, 12],
  'Florian Wirtz': [23, 89, 130],
  'Franck Kessié': [28, 85, 18],
  'Eric Bailly': [31, 85, 3],
  'Aymeric Laporte': [31, 85, 15],
  'Dani Olmo': [27, 85, 45],
  'Álvaro Morata': [33, 85, 12],
  'Luis Suárez': [39, 85, 3],
  'Ronald Araújo': [26, 85, 45],
  'Ousmane Dembélé': [28, 85, 50],
  'Olivier Giroud': [39, 85, 3],
  'Benjamin Pavard': [29, 85, 22],
  'Jules Koundé': [27, 85, 45],
  'Dayot Upamecano': [26, 85, 45],
  'Idrissa Gueye': [35, 85, 4],
  'Pape Matar Sarr': [22, 85, 35],
  'Alexis Mac Allister': [26, 86, 75],
  'Julián Álvarez': [26, 85, 80],
  'Ángel Di María': [37, 85, 4],
  'Nicolás Otamendi': [37, 85, 3],
  'Ramy Bensebaini': [30, 85, 12],
  'Youcef Atal': [29, 85, 15],
  'Musa Al-Taamari': [23, 85, 12],
  'Camilo Vargas': [36, 85, 2],
  'Chancel Mbemba': [30, 85, 8],
  'Cédric Bakambu': [34, 85, 4],
  'Yoane Wissa': [29, 85, 22],
  'Diogo Costa': [25, 85, 35],
  'João Félix': [26, 85, 35],
  'Jude Bellingham': [23, 90, 150],
  'Jack Grealish': [30, 85, 35],
  'Luke Shaw': [30, 85, 18],
  'Inaki Williams': [31, 85, 22],
  'Jordan Ayew': [34, 85, 4],
  'Borna Sosa': [27, 85, 15],
  'Bruno Petkovic': [31, 85, 8],
  'Marko Livaja': [31, 85, 6],
  Budimir: [34, 85, 5],
  'Tajon Buchanan': [26, 84, 18],
  'Yann Sommer': [37, 84, 3],
  'Manuel Akanji': [30, 84, 22],
  'Breel Embolo': [28, 84, 18],
  'Dan Ndoye': [24, 84, 22],
  'Brahim Díaz': [26, 84, 35],
  'Youssef En-Nesyri': [28, 84, 18],
  'Che Adams': [29, 84, 12],
  'John McGinn': [30, 84, 18],
  'Yunus Musah': [22, 84, 22],
  'Mathew Ryan': [33, 84, 3],
  'Harry Souttar': [26, 84, 8],
  'Julio Enciso': [21, 84, 22],
  'Kerem Aktürkoğlu': [26, 84, 18],
  'Pascal Groß': [34, 84, 5],
  'David Raum': [27, 84, 18],
  'Robert Arboleda': [33, 84, 3],
  'Felix Torres': [28, 84, 8],
  'Michael Estrada': [31, 84, 4],
  'Jeremie Frimpong': [24, 84, 35],
  'Steven Bergwijn': [27, 84, 15],
  'Emil Forsberg': [33, 84, 6],
  'Wahbi Khazri': [34, 84, 4],
  'Mehdi Taremi': [33, 84, 5],
  'Sardar Azmoun': [30, 84, 8],
  'Youri Tielemans': [28, 84, 35],
  'Jeremy Doku': [23, 84, 45],
  'Romelu Lukaku': [32, 84, 25],
  'Chris Wood': [33, 84, 6],
  'Dani Carvajal': [33, 84, 8],
  'Unai Simón': [28, 84, 25],
  'Marc Cucurella': [27, 84, 28],
  'Fabián Ruiz': [29, 84, 35],
  'José Giménez': [30, 84, 18],
  'Rodrigo Bentancur': [28, 84, 35],
  'Giorgian Arrascaeta': [31, 84, 18],
  'Salem Al-Dawsari': [33, 84, 8],
  'Mike Maignan': [30, 84, 35],
  'Adrien Rabiot': [30, 84, 25],
  'Bernd Leno': [33, 84, 8],
  'Sander Berge': [27, 84, 18],
  'Alexander Sørloth': [29, 84, 22],
  'Antonio Nusa': [20, 84, 25],
  'Abdu Diallo': [29, 84, 12],
  'Krépin Diatta': [26, 84, 15],
  'Ismaïla Sarr': [27, 84, 22],
  'Boulaye Dia': [28, 84, 12],
  'Gonzalo Montiel': [28, 84, 12],
  'Nicolás Tagliafico': [32, 84, 8],
  'Konrad Laimer': [28, 84, 25],
  'Florian Grillitsch': [29, 84, 12],
  'Michael Gregoritsch': [31, 84, 6],
  'Christoph Baumgartner': [26, 84, 18],
  'Baghdad Bounedjah': [33, 84, 3],
  'Youcef Belaïli': [33, 84, 4],
  'Houssem Aouar': [27, 84, 15],
  'Jhon Lucumí': [26, 84, 22],
  'Deiver Machado': [31, 84, 4],
  'Jhon Arias': [27, 84, 15],
  'Luis Sinisterra': [26, 84, 18],
  'Gael Kakuta': [33, 84, 3],
  'Edo Kayembe': [27, 84, 8],
  'Théo Bongonda': [29, 84, 8],
  'Fiston Mayele': [29, 84, 5],
  'Eldor Shomurodov': [29, 84, 6],
  'Abbosbek Fayzullaev': [21, 84, 18],
  'Jordan Pickford': [32, 84, 18],
  'Anthony Gordon': [24, 84, 35],
  'Daniel Amartey': [30, 84, 5],
  'Tariq Lamptey': [25, 84, 18],
  'Kamaldeen Sulemana': [23, 84, 18],
  'Anibal Godoy': [36, 84, 2],
  'Michael Murillo': [28, 84, 6],
  'Dominik Livakovic': [30, 84, 12],
  'Josip Juranovic': [29, 84, 8],
  Pasalic: [30, 84, 15],
  'Mateo Kovacic': [31, 86, 25],
  '堂安律': [27, 84, 15],
  'Ritsu Doan': [27, 84, 15],
  '南野拓实': [30, 84, 12],
  'Takumi Minamino': [30, 84, 12],
  '上田绮世': [27, 84, 12],
  'Ayase Ueda': [27, 84, 12],
  '板仓滉': [28, 84, 10],
  'Hiroki Itakura': [28, 84, 10],
  '大迫敬介': [26, 84, 8],
  'Keisuke Osako': [26, 84, 8],
  '黄喜灿': [29, 84, 12],
  'Hwang Hee-chan': [29, 84, 12],
  '金承奎': [34, 83, 2],
  'Kim Seung-gyu': [34, 83, 2],
  '李在城': [32, 83, 5],
  'Lee Jae-sung': [32, 83, 5],
  '黄仁范': [29, 83, 8],
  'Hwang In-beom': [29, 83, 8],
  '白昇浩': [26, 83, 6],
  'Paik Seung-ho': [26, 83, 6],
  'Antonín Barák': [30, 83, 8],
  安东宁·巴拉克: [30, 83, 8],
  'Adam Hložek': [23, 83, 12],
  亚当·赫洛热克: [23, 83, 12],
};

function extractTeamFifa(indexText) {
  const map = {};
  for (const m of indexText.matchAll(
    /name:\s*'([^']+)'[\s\S]*?fifa:\s*(\d+)/g,
  )) {
    map[m[1]] = Number(m[2]);
  }
  return map;
}

function extractPlayers(text) {
  const players = [];
  let currentTeam = null;
  for (const line of text.split('\n')) {
    const teamMatch = line.match(/^\s{2}([\u4e00-\u9fa5A-Za-z·]+):\s*L\(/);
    if (teamMatch) currentTeam = teamMatch[1];
    const playerMatch = line.match(
      /\[\s*(\d+),\s*'([^']+)',\s*'(GK|DF|MF|FW)'\s*\]/,
    );
    if (playerMatch && currentTeam) {
      players.push({
        team: currentTeam,
        number: Number(playerMatch[1]),
        name: playerMatch[2],
        position: playerMatch[3],
      });
    }
  }
  return players;
}

function estimateValue(ovr, age) {
  const bands = [
    [90, 120], [89, 80], [88, 55], [87, 40], [86, 30], [85, 22],
    [84, 18], [83, 14], [82, 11], [81, 8], [80, 6], [79, 4.5],
    [78, 3.5], [77, 2.8], [76, 2.2], [75, 1.8], [74, 1.4],
    [73, 1.1], [72, 0.9], [71, 0.7], [70, 0.55],
  ];
  let base = 0.25;
  for (const [minOvr, val] of bands) {
    if (ovr >= minOvr) {
      base = val;
      break;
    }
  }
  if (ovr < 70) base = Math.max(0.05, (ovr - 55) * 0.035);
  let ageMult = 1;
  if (age >= 35) ageMult = 0.25;
  else if (age >= 33) ageMult = 0.45;
  else if (age >= 31) ageMult = 0.65;
  else if (age >= 29) ageMult = 0.85;
  else if (age <= 20) ageMult = 1.35;
  else if (age <= 22) ageMult = 1.2;
  return Math.round(base * ageMult * 10) / 10;
}

function baseRating(fifa, position, idx) {
  let base = 68;
  if (fifa <= 8) base = 83;
  else if (fifa <= 15) base = 80;
  else if (fifa <= 25) base = 77;
  else if (fifa <= 40) base = 74;
  else if (fifa <= 55) base = 71;
  else if (fifa <= 70) base = 69;
  else base = 67;
  const posMod = { GK: 0, DF: -1, MF: 0, FW: 1 };
  const spread = (idx % 5) - 2;
  return Math.min(92, Math.max(60, base + (posMod[position] ?? 0) + spread));
}

function hashAge(name, teamFifa) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  const base = teamFifa <= 25 ? 26 : teamFifa <= 50 ? 27 : 28;
  return base + (Math.abs(h) % 7) - 3;
}

function main() {
  const lineups = fs.readFileSync(LINEUPS_PATH, 'utf8');
  const index = fs.readFileSync(INDEX_PATH, 'utf8');
  const teamFifa = extractTeamFifa(index);
  const players = extractPlayers(lineups);
  const stats = {};
  const teamIdx = {};

  for (const p of players) {
    if (stats[p.name]) continue;
    if (OVERRIDES[p.name]) {
      const [age, rating, value] = OVERRIDES[p.name];
      stats[p.name] = { age, rating, value };
      continue;
    }
    const fifa = teamFifa[p.team] ?? 60;
    const idx = teamIdx[p.team] ?? 0;
    teamIdx[p.team] = idx + 1;
    const rating = baseRating(fifa, p.position, idx);
    const age = hashAge(p.name, fifa);
    stats[p.name] = { age, rating, value: estimateValue(rating, age) };
  }

  const names = Object.keys(stats).sort();
  const lines = [
    '// 参考 EA FC 25 能力值 + Transfermarkt 风格身价（2026 世界杯语境）',
    '// 重新生成: node scripts/generate-worldcup-player-stats.mjs',
    'export interface PlayerStats {',
    '  age: number;',
    '  /** 身价（百万欧元） */',
    '  value: number;',
    '  /** EA FC 综合能力 */',
    '  rating: number;',
    '}',
    '',
    'export const PLAYER_STATS: Record<string, PlayerStats> = {',
  ];
  for (const name of names) {
    const s = stats[name];
    const key = name.includes("'") ? `"${name}"` : `'${name}'`;
    lines.push(
      `  ${key}: { age: ${s.age}, value: ${s.value}, rating: ${s.rating} },`,
    );
  }
  lines.push('};', '');
  fs.writeFileSync(OUT_PATH, lines.join('\n'));
  console.log(`Wrote ${names.length} players to ${OUT_PATH}`);
}

main();
