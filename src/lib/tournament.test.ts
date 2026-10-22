import test from 'node:test';
import assert from 'node:assert/strict';
import { getTournamentData, type Match } from '../data/tournament.ts';
import { calculateStandings, filterMatches, formatTime } from './tournament.ts';

const { teams, matches } = await getTournamentData();

test('demo fixtures have nine four-player teams, valid participants, and no court or player conflicts', () => {
  assert.equal(teams.length, 9);
  assert.equal(new Set(teams.flatMap((team) => team.players)).size, 36);
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
  assert.equal(rows[0].team.id, 'hocus-pocus');
  assert.equal(rows[0].wins, 2);
  assert.equal(rows[0].difference, 10);
  assert.equal(
    rows.reduce((n, row) => n + row.wins, 0),
    6,
  );
  assert.equal(
    rows.reduce((n, row) => n + row.losses, 0),
    6,
  );
  assert.equal(
    rows.reduce((n, row) => n + row.difference, 0),
    0,
  );
  assert.equal(calculateStandings(teams, matches, 'A').length, 3);
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
    matches[0],
    {
      ...matches[1],
      homeId: teams[2].id,
      awayId: teams[1].id,
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
    filterMatches(matches, teams, '  JAMIE chen  ', '', 'all').length,
    2,
  );
  assert.equal(filterMatches(matches, teams, 'boo', '', 'pool').length, 2);
  assert.equal(
    filterMatches(matches, teams, 'Jamie', 'latte-diggers', 'all').length,
    0,
  );
  assert.equal(filterMatches(matches, teams, '', 'boo-crew', 'all').length, 2);
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
