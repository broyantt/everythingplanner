import { apiFetch } from "../auth/api";

export async function loadSessions(currDate: string): Promise<number> {
  const token = localStorage.getItem("authToken");
  if (token) {
    const result = await apiFetch<{ count: number }>(
      `/sessions?date=${currDate}`,
    );
    return result.count;
  } else {
    const raw = localStorage.getItem("allSessions");
    const allSessions = raw ? JSON.parse(raw) : {};
    return allSessions[currDate] ?? 0;
  }
}

export async function loadAllSessions(): Promise<number> {
  const token = localStorage.getItem("authToken");
  if (token) {
    const result = await apiFetch<{ count: number }>("/sessions/total");
    return result.count;
  } else {
    const raw = localStorage.getItem("allSessions");
    const allSessions = raw ? JSON.parse(raw) : {};
    const totalSessions = Object.values(allSessions).reduce((acc, curr) => {
      return acc + curr;
    }, 0);
    return totalSessions;
  }
}

export async function saveSessions(
  currDate: string,
  count: number,
): Promise<void> {
  const token = localStorage.getItem("authToken");
  if (token) {
    await apiFetch("/sessions", {
      method: "POST",
      body: JSON.stringify({ date: currDate, count }),
    });
  } else {
    const raw = localStorage.getItem("allSessions");
    const allSessions = raw ? JSON.parse(raw) : {};
    allSessions[currDate] = count;
    localStorage.setItem("allSessions", JSON.stringify(allSessions));
  }
}
