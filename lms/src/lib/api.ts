const isBrowser = typeof window !== 'undefined';
const host = isBrowser ? window.location.hostname : '';
const isLocal = host === 'localhost' || host === '127.0.0.1' || host === '::1';
const DEFAULT_DEV_BASE = isBrowser && isLocal ? 'http://localhost:5000' : '';
export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_DEV_BASE;

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = API_BASE ? `${API_BASE}${path}` : path;
  const token = isBrowser ? localStorage.getItem('authToken') : null;
  try {
    const doFetch = async (u: string) => {
      const res = await fetch(u, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(init?.headers || {}),
        },
        ...init,
      });
      if (!res.ok) {
        const text = await res.text();
        const msg = `API ${res.status}: ${text || res.statusText}`;
        throw new Error(msg);
      }
      return res.json() as Promise<T>;
    };

    // If API_BASE is configured, use it directly to avoid double requests
    if (API_BASE) {
      return await doFetch(url);
    }

    // Otherwise, try relative path through Next.js rewrites
    const relative = path.startsWith('/') ? path : `/${path}`;
    return await doFetch(relative);
  } catch (err: any) {
    const tip = !API_BASE
      ? 'Set NEXT_PUBLIC_BACKEND_URL in .env.local (e.g., http://localhost:5000) or rely on Next.js rewrites'
      : `Verify backend is running at ${API_BASE}`;
    throw new Error(`Failed to fetch ${url}. ${tip}. Original: ${err?.message || err}`);
  }
}
