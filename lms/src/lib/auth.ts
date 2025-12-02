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
