export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CHALLENGES: '/challenges',
  LEADERBOARD: '/leaderboard',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  NOT_FOUND: '*'
} as const;

export const ROUTE_SEGMENTS = {
  DASHBOARD: 'dashboard',
  CHALLENGES: 'challenges',
  LEADERBOARD: 'leaderboard',
  ABOUT: 'about'
} as const;
