const API_BASE = import.meta.env.VITE_API_BASE_URL || ""; // blank in dev (proxy), set in prod

export async function loginRequest({ email, password }) {
  const r = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),  // JSON (matches your backend)
  });
  if (!r.ok) throw new Error(await r.text().catch(() => `Login failed (${r.status})`));
  return r.json(); // { token, user }
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}
export function getToken() {
  return localStorage.getItem("token");
}
export function clearToken() {
  localStorage.removeItem("token");
}

// Optional: authed GET helper you can reuse
export async function apiGet(path) {
  const r = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getToken() || ""}`,
    },
  });
  if (!r.ok) throw new Error(await r.text().catch(() => `API ${r.status}`));
  return r.json();
}
