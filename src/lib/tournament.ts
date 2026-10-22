import type { Match, Pool, Team } from '../data/tournament.ts';

export interface Standing {
  team: Team;
  played: number;
  wins: number;
  losses: number;
  pointsFor: number;
  pointsAgainst: number;
  difference: number;
  rank: number;
}

export function calculateStandings(
  teams: Team[],
  matches: Match[],
  pool?: Pool,
): Standing[] {
  const rows = teams
    .filter((team) => !pool || team.pool === pool)
    .map((team) => ({
      team,
      played: 0,
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      difference: 0,
      rank: 0,
    }));
  for (const match of matches) {
    // Playoff results never change the pool standings. Incomplete or invalid scores don't count.
    if (match.stage !== 'pool' || match.status !== 'final' || !match.score)
      continue;
    const [home, away] = match.score;
    if (
      ![home, away].every((score) => Number.isInteger(score) && score >= 0) ||
      home === away
    )
      continue;
    for (const row of rows) {
      if (row.team.id !== match.homeId && row.team.id !== match.awayId)
        continue;
      const isHome = row.team.id === match.homeId;
      const scored = isHome ? home : away;
      const conceded = isHome ? away : home;
      row.played++;
      row.wins += Number(scored > conceded);
      row.losses += Number(scored < conceded);
      row.pointsFor += scored;
      row.pointsAgainst += conceded;
      row.difference = row.pointsFor - row.pointsAgainst;
    }
  }
  rows.sort(
    (a, b) =>
      b.wins - a.wins ||
      b.difference - a.difference ||
      a.team.name.localeCompare(b.team.name),
  );
  rows.forEach((row, index) => {
    const previous = rows[index - 1];
    row.rank =
      previous &&
      previous.wins === row.wins &&
      previous.difference === row.difference
        ? previous.rank
        : index + 1;
  });
  return rows;
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export function filterMatches(
  matches: Match[],
  teams: Team[],
  query: string,
  teamId: string,
  stage: 'all' | 'pool' | 'playoff',
): Match[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return matches.filter((match) => {
    if (stage !== 'all' && stage !== match.stage) return false;
    if (teamId && match.homeId !== teamId && match.awayId !== teamId)
      return false;
    const participants = teams.filter(
      (team) => team.id === match.homeId || team.id === match.awayId,
    );
    const searchable = normalize(
      participants.flatMap((team) => [team.name, ...team.players]).join(' '),
    );
    return terms.every((term) => searchable.includes(term));
  });
}

export function formatTime(time: string): string {
  const [hour, minute] = time.split(':').map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'pm' : 'am'}`;
}
