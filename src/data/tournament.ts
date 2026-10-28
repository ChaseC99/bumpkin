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
  refereeId?: string;
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
  time: '9:30 am – 4:00 pm',
  location: 'Las Palmas Park, Sunnyvale',
  teamCount: 7,
  format: 'Grass volleyball · 1 pool · 3 courts',
} as const;

// Single-pool event: all seven teams are part of one pool and rotate across three courts.
const teams: Team[] = [
  {
    id: 't1',
    name: 'Canto Fiends + Two Jump Chumps',
    shortName: 'Canto + Chumps',
    icon: 'bat',
    color: 'purple',
    pool: 'A',
    players: ['Miranda', 'Sara', 'Karan', 'Justin'],
  },
  {
    id: 't2',
    name: 'No u come up with one + San Fran Spooks',
    shortName: 'No u + Spooks',
    icon: 'coffee',
    color: 'orange',
    pool: 'A',
    players: ['Alice', 'Ash', 'Chase', 'Rachel'],
  },
  {
    id: 't3',
    name: 'idk + Sung Jinwoo',
    shortName: 'idk + Sung Jinwoo',
    icon: 'moon',
    color: 'green',
    pool: 'A',
    players: ['Jiwan', 'Allison', 'Ryan V', 'Stacy'],
  },
  {
    id: 't4',
    name: 'Magic Mike Shrooms + We suck @ Fishing',
    shortName: 'Magic Mike + Fishing',
    icon: 'ghost',
    color: 'purple',
    pool: 'A',
    players: ['Justine', 'Ray', 'Alex', 'Will'],
  },
  {
    id: 't5',
    name: 'LeBlock + Andre & Bryson',
    shortName: 'LeBlock + Andre & Bryson',
    icon: 'bolt',
    color: 'green',
    pool: 'A',
    players: ['Victor', 'Jacob', 'Andre', 'Bryson'],
  },
  {
    id: 't6',
    name: 'Tyler + Chuds + Jackie & Prajanya',
    shortName: 'Chuds + Jackie & Prajanya',
    icon: 'hat',
    color: 'purple',
    pool: 'A',
    players: ['David', 'Tyler', 'Jackie', 'Prajanya'],
  },
  {
    id: 't7',
    name: 'Your Last 2 Braincells + Magicpissers',
    shortName: 'Braincells + Magicpissers',
    icon: 'sparkles',
    color: 'orange',
    pool: 'A',
    players: ['Achinthya', 'Lucas', 'Ajay', 'Jonathan C'],
  },
];

const matches: Match[] = [
  {
    id: 'r1-c1',
    stage: 'pool',
    pool: 'A',
    round: 1,
    time: '10:00',
    court: 1,
    homeId: 't1',
    awayId: 't4',
    refereeId: 't7',
    status: 'scheduled',
    score: null,
  },
  {
    id: 'r1-c2',
    stage: 'pool',
    pool: 'A',
    round: 1,
    time: '10:00',
    court: 2,
    homeId: 't2',
    awayId: 't5',
    refereeId: 't7',
    status: 'scheduled',
    score: null,
  },
  {
    id: 'r1-c3',
    stage: 'pool',
    pool: 'A',
    round: 1,
    time: '10:00',
    court: 3,
    homeId: 't3',
    awayId: 't6',
    refereeId: 't7',
    status: 'scheduled',
    score: null,
  },
  {
    id: 'r2-c1',
    stage: 'pool',
    pool: 'A',
    round: 2,
    time: '10:45',
    court: 1,
    homeId: 't1',
    awayId: 't5',
    refereeId: 't6',
    status: 'scheduled',
    score: null,
  },
  {
    id: 'r2-c2',
    stage: 'pool',
    pool: 'A',
    round: 2,
    time: '10:45',
    court: 2,
    homeId: 't2',
    awayId: 't4',
    refereeId: 't6',
    status: 'scheduled',
    score: null,
  },
  {
    id: 'r2-c3',
    stage: 'pool',
    pool: 'A',
    round: 2,
    time: '10:45',
    court: 3,
    homeId: 't3',
    awayId: 't7',
    refereeId: 't6',
    status: 'scheduled',
    score: null,
  },
  {
    id: 'r3-c1',
    stage: 'pool',
    pool: 'A',
    round: 3,
    time: '11:30',
    court: 1,
    homeId: 't1',
    awayId: 't6',
    refereeId: 't2',
    status: 'scheduled',
    score: null,
  },
  {
    id: 'r3-c2',
    stage: 'pool',
    pool: 'A',
    round: 3,
    time: '11:30',
    court: 2,
    homeId: 't3',
    awayId: 't4',
    refereeId: 't2',
    status: 'scheduled',
    score: null,
  },
  {
    id: 'r3-c3',
    stage: 'pool',
    pool: 'A',
    round: 3,
    time: '11:30',
    court: 3,
    homeId: 't5',
    awayId: 't7',
    refereeId: 't2',
    status: 'scheduled',
    score: null,
  },
  {
    id: 'r4-c1',
    stage: 'pool',
    pool: 'A',
    round: 4,
    time: '12:15',
    court: 1,
    homeId: 't1',
    awayId: 't7',
    refereeId: 't4',
    status: 'scheduled',
    score: null,
  },
  {
    id: 'r4-c2',
    stage: 'pool',
    pool: 'A',
    round: 4,
    time: '12:15',
    court: 2,
    homeId: 't2',
    awayId: 't6',
    refereeId: 't4',
    status: 'scheduled',
    score: null,
  },
];

// Data boundary for a future Supabase adapter. No UI component talks to a database.
export async function getTournamentData(): Promise<TournamentData> {
  return { mode: 'demo', teams, matches };
}
