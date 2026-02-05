// Server URL: set EXPO_PUBLIC_SERVER_URL in .env or default to production
export const getServerUrl = (): string =>
  process.env.EXPO_PUBLIC_SERVER_URL ?? 'https://splitwiz-production.up.railway.app';

// Base URL for sharing event links (web fallback)
export const getWebBaseUrl = (): string =>
  process.env.EXPO_PUBLIC_WEB_BASE_URL ?? 'https://how2split.netlify.app';
