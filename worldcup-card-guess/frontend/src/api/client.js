const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const payload = await response.json().catch(() => ({ success: false, message: "接口返回格式错误" }));
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "请求失败");
  }
  return payload.data;
}

export const api = {
  dashboard: () => request("/dashboard"),
  users: () => request("/users"),
  matches: () => request("/matches"),
  ranking: () => request("/ranking"),
  cardMarket: () => request("/cards/market"),
  hotSquads: () => request("/squads/hot"),
  playerDetail: (playerId) => request(`/players/${playerId}`),
  submitGuess: (body) => request("/guesses", { method: "POST", body: JSON.stringify(body) }),
  finishMatch: (matchId, body) => request(`/matches/${matchId}/finish`, { method: "POST", body: JSON.stringify(body) }),
  deleteMatch: (matchId) => request(`/matches/${matchId}`, { method: "DELETE" })
};
