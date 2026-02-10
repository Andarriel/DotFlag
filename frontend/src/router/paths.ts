export const ROUTES = {
  HOME: '/',
  CHALLENGES: '/challenges',
  LEADERBOARD: '/leaderboard',
  LOGIN: '/login',
  REGISTER: '/register',
  NOT_FOUND: '*'
} as const;

export const ROUTE_SEGMENTS = {
  CHALLENGES: 'challenges',
  LEADERBOARD: 'leaderboard'
} as const;
