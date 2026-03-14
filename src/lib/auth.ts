// Simple cookie-based admin auth
// Set ADMIN_PASSWORD env var in Vercel or .env.local

const COOKIE_NAME = 'bmt_admin';
const SESSION_TOKEN = 'bmt_authenticated';

export function getAdminPassword(): string {
  return import.meta.env.ADMIN_PASSWORD || 'beachmoney2026';
}

export function isAuthenticated(request: Request): boolean {
  const cookies = request.headers.get('cookie') || '';
  return cookies.includes(`${COOKIE_NAME}=${SESSION_TOKEN}`);
}

export function createAuthCookie(): string {
  // 24h expiry
  return `${COOKIE_NAME}=${SESSION_TOKEN}; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=86400`;
}

export function createLogoutCookie(): string {
  return `${COOKIE_NAME}=; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=0`;
}
