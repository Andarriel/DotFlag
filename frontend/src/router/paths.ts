export const ROUTES = {
  HOME: '/',
  CHALLENGES: '/challenges',
  LEADERBOARD: '/leaderboard',
  LOGIN: '/login',
  NOT_FOUND: '*'
} as const;

export const ROUTE_SEGMENTS = {
  CHALLENGES: 'challenges',
  LEADERBOARD: 'leaderboard'
} as const;
