import { API_BASE } from "../constants/api";

export const todoApi = {
  async getAllTodos() {
    const res = await fetch(`${API_BASE}/api/todos`);
    if (!res.ok) throw new Error(`GET 실패: ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },

  async createTodo(title, todoAt, detail) {
    const res = await fetch(`${API_BASE}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, todoAt, detail }),
    });
    if (!res.ok) throw new Error(`POST 실패: ${res.status}`);
  },

  async toggleTodo(id) {
    const res = await fetch(`${API_BASE}/api/todos/${id}/toggle`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error(`PATCH 실패: ${res.status}`);
  },

  async deleteDoneTodos() {
    const res = await fetch(`${API_BASE}/api/todos/done`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`DELETE 실패: ${res.status}`);
  },
};

