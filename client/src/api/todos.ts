import type { Todo } from "../App";
import { apiFetch } from "../auth/api";

export async function loadTodos(date: string): Promise<Todo[]> {
  const token = localStorage.getItem("authToken");
  if (token) {
    const data = await apiFetch<{ todos: Todo[] }>(`/todos?date=${date}`);
    return data.todos;
  } else {
    const raw = localStorage.getItem("allTodos");
    const allTodos = raw ? JSON.parse(raw) : {};
    return allTodos[date] ?? [];
  }
}

export async function saveTodos(date: string, todos: Todo[]): Promise<void> {
  const token = localStorage.getItem("authToken");
  if (token) {
    await apiFetch<{ todos: Todo[] }>("/todos", {
      method: "POST",
      body: JSON.stringify({ date, todos }),
    });
  } else {
    const raw = localStorage.getItem("allTodos");
    const allTodos = raw ? JSON.parse(raw) : {};
    allTodos[date] = todos;
    localStorage.setItem("allTodos", JSON.stringify(allTodos));
  }
}

export async function loadSummary() {
  const token = localStorage.getItem("authToken");
  if (token) {
    const result = await apiFetch<{
      summary: Record<string, "completed" | "ongoing">;
    }>("/todos/summary");
    return result.summary;
  } else {
    const raw = localStorage.getItem("allTodos");
    const allTodos: Record<string, { text: string; completed: boolean }[]> = raw
      ? JSON.parse(raw)
      : {};
    const summary: Record<string, "completed" | "ongoing"> = {};
    for (const [date, todos] of Object.entries(allTodos)) {
      if (todos.length === 0) continue;
      summary[date] = todos.every((t) => {
        return t.completed;
      })
        ? "completed"
        : "ongoing";
    }
    return summary;
  }
}
