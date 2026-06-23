export interface LineupPlayer {
  number: number;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
}

export interface TeamLineup {
  formation: string;
  starters: LineupPlayer[];
  substitutes: LineupPlayer[];
  note?: string;
}

export interface MatchLineupPreview {
  matchKey: string;
  group: string;
  home: string;
  away: string;
  date: string;
  md: number;
  homeLineup: TeamLineup;
  awayLineup: TeamLineup;
  previewNote?: string;
}
