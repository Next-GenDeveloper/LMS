const DEFAULT_DEV_BASE = typeof window !== 'undefined' && location.hostname === 'localhost' ? 'http://localhost:5000' : '';
export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || DEFAULT_DEV_BASE;

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = API_BASE ? `${API_BASE}${path}` : path;
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const res = await fetch(url, {
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
}
