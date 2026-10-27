export type Pool = 'A' | 'B' | 'C';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  icon:
    | 'ghost'
    | 'pumpkin'
    | 'moon'
    | 'bolt'
    | 'coffee'
    | 'bat'
    | 'sparkles'
    | 'leaf'
    | 'hat';
  color: 'orange' | 'purple' | 'green';
  pool: Pool;
  players: string[];
}

export interface Match {
  id: string;
  stage: 'pool' | 'playoff';
  pool?: Pool;
  round: number;
  time: string;
  court: number;
  homeId: string;
  awayId: string;
  status: 'scheduled' | 'final';
  score: [number, number] | null;
}

export interface TournamentData {
  mode: 'demo';
  teams: Team[];
  matches: Match[];
}

export const event = {
  name: 'Bump-kin Set Latte',
  date: 'Saturday, October 31, 2026',
  shortDate: 'Saturday, October 31',
  time: '~9:30 am – 4:30 pm',
  location: 'Las Palmas or Washington Park',
  teamCount: 7,
  format: 'Grass volleyball · 4 × 4',
} as const;

// Fictional rosters and illustrative pools. Replace once teams are assigned.
const teams: Team[] = [
  {
    id: 'boo-crew',
    name: 'The Boo Crew',
    shortName: 'Boo Crew',
    icon: 'ghost',
    color: 'purple',
    pool: 'A',
    players: ['Alex Morgan', 'Jamie Chen', 'Sam Rivera', 'Taylor Park'],
  },
  {
    id: 'pumpkin-spice',
    name: 'Pumpkin Spikers',
    shortName: 'Spikers',
    icon: 'pumpkin',
    color: 'orange',
    pool: 'A',
    players: ['Jordan Lee', 'Casey Brooks', 'Riley Patel', 'Morgan Reed'],
  },
  {
    id: 'full-moon',
    name: 'Full Moon Ballers',
    shortName: 'Full Moon',
    icon: 'moon',
    color: 'green',
    pool: 'A',
    players: ['Avery Kim', 'Drew Ellis', 'Skyler Tran', 'Quinn Davis'],
  },
  {
    id: 'monster-block',
    name: 'Monster Block',
    shortName: 'Monsters',
    icon: 'bolt',
    color: 'green',
    pool: 'B',
    players: ['Cameron Fox', 'Reese Miller', 'Blake Nguyen', 'Rowan James'],
  },
  {
    id: 'hocus-pocus',
    name: 'Hocus Pocus',
    shortName: 'Hocus Pocus',
    icon: 'hat',
    color: 'purple',
    pool: 'B',
    players: ['Sage Wilson', 'Finley Adams', 'Emerson Cole', 'Parker Singh'],
  },
  {
    id: 'latte-diggers',
    name: 'Latte Diggers',
    shortName: 'Latte Diggers',
    icon: 'coffee',
    color: 'orange',
    pool: 'B',
    players: ['Hayden Ross', 'Dakota Bell', 'Charlie Wu', 'Kendall Scott'],
  },
  {
    id: 'bat-attitude',
    name: 'Bat Attitude',
    shortName: 'Bat Attitude',
    icon: 'bat',
    color: 'purple',
    pool: 'C',
    players: ['Robin Hayes', 'Jules Garcia', 'Noel Martin', 'Elliot Clark'],
  },
  {
    id: 'sets-spells',
    name: 'Sets & Spells',
    shortName: 'Sets & Spells',
    icon: 'sparkles',
    color: 'orange',
    pool: 'C',
    players: ['Harper Young', 'Remy Allen', 'Shiloh Baker', 'Micah Lewis'],
  },
  {
    id: 'fall-ball',
    name: 'Fall Ballers',
    shortName: 'Fall Ballers',
    icon: 'leaf',
    color: 'green',
    pool: 'C',
    players: ['River Hall', 'Arden King', 'Phoenix Wright', 'Marley Green'],
  },
];

const matches: Match[] = [
  {
    id: 'a1',
    stage: 'pool',
    pool: 'A',
    round: 1,
    time: '09:30',
    court: 1,
    homeId: 'boo-crew',
    awayId: 'pumpkin-spice',
    status: 'final',
    score: [25, 18],
  },
  {
    id: 'b1',
    stage: 'pool',
    pool: 'B',
    round: 1,
    time: '09:30',
    court: 2,
    homeId: 'monster-block',
    awayId: 'hocus-pocus',
    status: 'final',
    score: [21, 25],
  },
  {
    id: 'c1',
    stage: 'pool',
    pool: 'C',
    round: 1,
    time: '09:30',
    court: 3,
    homeId: 'bat-attitude',
    awayId: 'sets-spells',
    status: 'final',
    score: [25, 20],
  },
  {
    id: 'a2',
    stage: 'pool',
    pool: 'A',
    round: 2,
    time: '10:00',
    court: 1,
    homeId: 'pumpkin-spice',
    awayId: 'full-moon',
    status: 'final',
    score: [25, 23],
  },
  {
    id: 'b2',
    stage: 'pool',
    pool: 'B',
    round: 2,
    time: '10:00',
    court: 2,
    homeId: 'hocus-pocus',
    awayId: 'latte-diggers',
    status: 'final',
    score: [25, 19],
  },
  {
    id: 'c2',
    stage: 'pool',
    pool: 'C',
    round: 2,
    time: '10:00',
    court: 3,
    homeId: 'sets-spells',
    awayId: 'fall-ball',
    status: 'final',
    score: [22, 25],
  },
  {
    id: 'a3',
    stage: 'pool',
    pool: 'A',
    round: 3,
    time: '10:30',
    court: 1,
    homeId: 'full-moon',
    awayId: 'boo-crew',
    status: 'scheduled',
    score: null,
  },
  {
    id: 'b3',
    stage: 'pool',
    pool: 'B',
    round: 3,
    time: '10:30',
    court: 2,
    homeId: 'latte-diggers',
    awayId: 'monster-block',
    status: 'scheduled',
    score: null,
  },
  {
    id: 'c3',
    stage: 'pool',
    pool: 'C',
    round: 3,
    time: '10:30',
    court: 3,
    homeId: 'fall-ball',
    awayId: 'bat-attitude',
    status: 'scheduled',
    score: null,
  },
];

// Data boundary for a future Supabase adapter. No UI component talks to a database.
export async function getTournamentData(): Promise<TournamentData> {
  return { mode: 'demo', teams, matches };
}
