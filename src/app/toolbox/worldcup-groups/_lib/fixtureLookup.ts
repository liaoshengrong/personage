import { FIXTURES, type Fixture, type GroupLetter } from '../_data';

export function buildMatchKey(
  group: GroupLetter,
  home: string,
  away: string,
  md: number,
) {
  return `${group}-R${md}-${home}-vs-${away}`;
}

export function findFixture(
  group: GroupLetter,
  teamName: string,
  opponent: string,
  md: number,
): Fixture | undefined {
  return FIXTURES[group].find(
    (f) =>
      f.md === md &&
      ((f.home === teamName && f.away === opponent) ||
        (f.home === opponent && f.away === teamName)),
  );
}

export function getUnplayedFixtures() {
  const list: Array<Fixture & { group: GroupLetter; matchKey: string }> = [];
  (Object.keys(FIXTURES) as GroupLetter[]).forEach((group) => {
    FIXTURES[group].forEach((f) => {
      if (!f.played) {
        list.push({
          ...f,
          group,
          matchKey: buildMatchKey(group, f.home, f.away, f.md),
        });
      }
    });
  });
  return list.sort((a, b) => a.date.localeCompare(b.date) || a.md - b.md);
}
