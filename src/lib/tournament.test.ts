import test from 'node:test';
import assert from 'node:assert/strict';
import { getTournamentData, type Match } from '../data/tournament.ts';
import {
  buildPlayoffSchedule,
  calculateStandings,
  filterMatches,
  formatTime,
} from './tournament.ts';

const { teams, matches } = await getTournamentData();

test('demo fixtures have seven four-player teams, valid participants, and no court or player conflicts', () => {
  assert.equal(teams.length, 7);
  assert.equal(new Set(teams.flatMap((team) => team.players)).size, 28);
  const bookings = new Set<string>();
  const courtSlots = new Set<string>();
  for (const team of teams) assert.equal(team.players.length, 4);
  for (const match of matches) {
    assert.notEqual(match.homeId, match.awayId);
    assert.ok(teams.some((team) => team.id === match.homeId));
    assert.ok(teams.some((team) => team.id === match.awayId));
    for (const id of [match.homeId, match.awayId]) {
      const key = `${match.time}-${id}`;
      assert.ok(!bookings.has(key));
      bookings.add(key);
    }
    const court = `${match.time}-${match.court}`;
    assert.ok(!courtSlots.has(court));
    courtSlots.add(court);
  }
});

test('standings count completed pool games and conserve points and wins', () => {
  const rows = calculateStandings(teams, matches);
  assert.ok(rows.length >= 3);
  assert.equal(
    rows.reduce((n, row) => n + row.wins, 0),
    matches.filter((match) => match.status === 'final').length,
  );
  assert.equal(
    rows.reduce((n, row) => n + row.losses, 0),
    matches.filter((match) => match.status === 'final').length,
  );
  assert.equal(
    rows.reduce((n, row) => n + row.difference, 0),
    0,
  );
  assert.equal(calculateStandings(teams, matches, 'A').length, 7);
});

test('unplayed, tied, invalid, and playoff scores do not alter pool standings', () => {
  const cases: Match[] = [
    { ...matches[0], status: 'scheduled', score: [25, 12] },
    { ...matches[0], score: [25, 25] },
    { ...matches[0], score: [-1, 25] },
    { ...matches[0], score: [Number.NaN, 25] },
    { ...matches[0], stage: 'playoff' },
    { ...matches[0], score: null },
  ];
  assert.ok(
    calculateStandings(teams, cases).every(
      (row) => row.played === 0 && row.rank === 1,
    ),
  );
});

test('equivalent records share a rank with competition numbering', () => {
  const rows = calculateStandings(teams.slice(0, 3), [
    {
      ...matches[0],
      homeId: teams[0].id,
      awayId: teams[1].id,
      status: 'final',
      score: [25, 18],
    },
    {
      ...matches[1],
      homeId: teams[2].id,
      awayId: teams[1].id,
      status: 'final',
      score: [25, 18],
    },
  ]);
  assert.deepEqual(
    rows.map((row) => row.rank),
    [1, 1, 3],
  );
});

test('search supports partial names, case, whitespace, and intersecting filters', () => {
  assert.equal(
    filterMatches(matches, teams, '  alex  ', '', 'all').length,
    3,
  );
  assert.equal(filterMatches(matches, teams, 'fishing', '', 'pool').length, 3);
  assert.equal(
    filterMatches(matches, teams, 'allison', 't4', 'all').length,
    0,
  );
  assert.equal(filterMatches(matches, teams, '', 't4', 'all').length, 3);
  assert.equal(filterMatches(matches, teams, '', '', 'playoff').length, 0);
  assert.equal(
    filterMatches(matches, teams, 'not a player', '', 'all').length,
    0,
  );
});

test('times format as local tournament times without a browser timezone shift', () => {
  assert.equal(formatTime('09:30'), '9:30 am');
  assert.equal(formatTime('12:00'), '12:00 pm');
  assert.equal(formatTime('16:00'), '4:00 pm');
});

test('playoffs seed 1v4, 2v3, and 6v7, with seed 5 refereeing', () => {
  const completed = matches.map((match) => ({
    ...match,
    status: 'final' as const,
    score: [25, 10] as [number, number],
  }));
  const schedule = buildPlayoffSchedule(teams, completed);
  const roundOne = schedule.games.filter((game) => game.round === 1);
  const standings = calculateStandings(teams, completed);

  assert.equal(schedule.ready, true);
  assert.deepEqual(
    roundOne.map((game) => [game.court, game.home.teamId, game.away.teamId]),
    [
      [1, standings[0].team.id, standings[3].team.id],
      [2, standings[1].team.id, standings[2].team.id],
      [3, standings[5].team.id, standings[6].team.id],
    ],
  );
  assert.equal(roundOne[0].time, '12:45');
  assert.equal(roundOne[0].referee, standings[4].team.players.join(', '));
  assert.equal(schedule.games.find((game) => game.round === 2)?.time, '13:30');
  assert.equal(schedule.games.find((game) => game.round === 2)?.referee, 'TBD');
});

test('win percentage takes priority over total wins for playoff seeding', () => {
  const completed = [
    ...matches.slice(0, 4).map((match, index) => ({
      ...match,
      homeId: 't1',
      awayId: teams[index + 2].id,
      status: 'final' as const,
      score: (index === 3 ? [10, 25] : [25, 10]) as [number, number],
    })),
    ...matches.slice(4, 6).map((match, index) => ({
      ...match,
      homeId: 't2',
      awayId: teams[index + 4].id,
      status: 'final' as const,
      score: [25, 10] as [number, number],
    })),
  ];
  const standings = calculateStandings(teams, completed);
  const t1 = standings.find((row) => row.team.id === 't1')!;
  const t2 = standings.find((row) => row.team.id === 't2')!;

  assert.equal(t1.wins, 3);
  assert.equal(t1.winPercentage, 0.75);
  assert.equal(t2.wins, 2);
  assert.equal(t2.winPercentage, 1);
  assert.ok(standings.indexOf(t2) < standings.indexOf(t1));
});
