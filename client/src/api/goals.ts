import { apiFetch } from "../auth/api";
import type { Goal } from "../components/GoalTracker/GoalTracker";

export async function loadGoals(year: number) {
  const token = localStorage.getItem("authToken");
  if (token) {
    const result = await apiFetch<{ goals: Goal[] }>(`/goals?year=${year}`);
    return result.goals;
  } else {
    const raw = localStorage.getItem("allGoals");
    const allGoals = raw ? JSON.parse(raw) : {};
    return allGoals[year] ?? [];
  }
}

export async function saveGoals(year: number, goals: Goal[]) {
  const token = localStorage.getItem("authToken");
  if (token) {
    await apiFetch("/goals", {
      method: "POST",
      body: JSON.stringify({ year, goals }),
    });
  } else {
    const raw = localStorage.getItem("allGoals");
    const allGoals = raw ? JSON.parse(raw) : {};
    allGoals[year] = goals;
    localStorage.setItem("allGoals", JSON.stringify(allGoals));
  }
}
