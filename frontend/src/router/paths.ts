export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CHALLENGES: '/challenges',
  CHALLENGE_DETAIL: '/challenges/:id',
  LEADERBOARD: '/leaderboard',
  ADMIN: '/admin',
  TEAM: '/team',
  PROFILE: '/profile/:id',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  SERVER_ERROR: '/server-error',
  NOT_FOUND: '*',
} as const;

export const ROUTE_SEGMENTS = {
  DASHBOARD: 'dashboard',
  CHALLENGES: 'challenges',
  CHALLENGE_DETAIL: 'challenges/:id',
  LEADERBOARD: 'leaderboard',
  ADMIN: 'admin',
  TEAM: 'team',
  PROFILE: 'profile/:id',
  ABOUT: 'about',
} as const;
