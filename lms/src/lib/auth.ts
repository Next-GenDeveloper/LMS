export type JwtPayload = {
  userId: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  iat?: number;
  exp?: number;
};

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function decodeJwt<T = unknown>(token: string): T | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function getUserFromToken(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;
  return decodeJwt<JwtPayload>(token);
}

export function isInstructor(): boolean {
  const u = getUserFromToken();
  return u?.role === 'instructor' || u?.role === 'admin';
}

export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('authToken');
}

export function getDisplayName(): string {
  if (typeof window === 'undefined') return 'User';
  try {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      const p = JSON.parse(profile) as { firstName?: string; lastName?: string; email?: string };
      if (p.firstName || p.lastName) return [p.firstName, p.lastName].filter(Boolean).join(' ').trim();
      if (p.email) return p.email.split('@')[0];
    }
  } catch {}
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      const payload = decodeJwt<{ email?: string }>(token);
      if (payload?.email) return payload.email.split('@')[0];
    } catch {}
  }
  return 'User';
}

function toBase64Url(obj: any): string {
  const json = JSON.stringify(obj);
  const b64 = typeof window !== 'undefined' ? btoa(json) : Buffer.from(json).toString('base64');
  return b64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function createMockToken(payload: JwtPayload): string {
  const header = { alg: 'none', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + 60 * 60 * 24 * 7 };
  return `${toBase64Url(header)}.${toBase64Url(body)}.`; // unsigned
}
