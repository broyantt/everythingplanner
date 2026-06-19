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
