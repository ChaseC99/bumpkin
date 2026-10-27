import type { Match, Pool, Team } from '../data/tournament.ts';

export interface Standing {
  team: Team;
  played: number;
  wins: number;
  losses: number;
  winPercentage: number;
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
      winPercentage: 0,
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
      row.winPercentage = row.wins / row.played;
      row.pointsFor += scored;
      row.pointsAgainst += conceded;
      row.difference = row.pointsFor - row.pointsAgainst;
    }
  }
  rows.sort(
    (a, b) =>
      b.winPercentage - a.winPercentage ||
      b.difference - a.difference ||
      a.team.name.localeCompare(b.team.name),
  );
  rows.forEach((row, index) => {
    const previous = rows[index - 1];
    row.rank =
      previous &&
      previous.winPercentage === row.winPercentage &&
      previous.difference === row.difference
        ? previous.rank
        : index + 1;
  });
  return rows;
}

export interface PlayoffParticipant {
  teamId?: string;
  label: string;
}

export interface PlayoffGame {
  id: string;
  round: 1 | 2;
  time: string;
  court: number;
  title: string;
  home: PlayoffParticipant;
  away: PlayoffParticipant;
  referee: string;
}

export interface PlayoffSchedule {
  ready: boolean;
  games: PlayoffGame[];
}

export function buildPlayoffSchedule(
  teams: Team[],
  matches: Match[],
): PlayoffSchedule {
  const poolMatches = matches.filter((match) => match.stage === 'pool');
  const ready =
    poolMatches.length > 0 &&
    poolMatches.every(
      (match) =>
        match.status === 'final' &&
        match.score !== null &&
        match.score.every((score) => Number.isInteger(score) && score >= 0) &&
        match.score[0] !== match.score[1],
    );
  const standings = calculateStandings(teams, matches);
  const participant = (row: Standing | undefined, seed: number): PlayoffParticipant =>
    ready && row
      ? { teamId: row.team.id, label: row.team.name }
      : { label: `Seed ${seed} · pending` };
  const winner = (label: string): PlayoffParticipant => ({ label });
  const referee = ready
    ? standings[4]?.team.players.join(', ') ?? 'TBD'
    : '5th place team · pending';
  const game = (
    id: string,
    round: 1 | 2,
    time: string,
    court: number,
    title: string,
    home: PlayoffParticipant,
    away: PlayoffParticipant,
    gameReferee = round === 1 ? referee : 'TBD',
  ): PlayoffGame => ({
    id,
    round,
    time,
    court,
    title,
    home,
    away,
    referee: gameReferee,
  });
  return {
    ready,
    games: [
      game('playoff-r1-c1', 1, '12:45', 1, 'Upper bracket · Semifinal 1', participant(standings[0], 1), participant(standings[3], 4)),
      game('playoff-r1-c2', 1, '12:45', 2, 'Upper bracket · Semifinal 2', participant(standings[1], 2), participant(standings[2], 3)),
      game('playoff-r1-c3', 1, '12:45', 3, 'Lower bracket · Semifinal', participant(standings[5], 6), participant(standings[6], 7)),
      game('playoff-r2-c1', 2, '13:30', 1, 'Upper bracket championship', winner('Winner of upper semifinal 1'), winner('Winner of upper semifinal 2')),
      game('playoff-r2-c2', 2, '13:30', 2, 'Lower bracket championship', participant(standings[4], 5), winner('Winner of lower semifinal')),
    ],
  };
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
