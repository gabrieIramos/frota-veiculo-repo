export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as Record<string, string>;

  // Ensure Content-Type is preserved if provided; don't overwrite
  return fetch(input, { ...init, headers });
}
