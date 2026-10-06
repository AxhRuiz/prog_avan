// La URL del backend se define en build-time via variable de entorno
// (VITE_API_URL), inyectada por Docker. Si no está, usa localhost:3002.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3002";

async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `Error ${res.status}`);
  }
  return data;
}

export async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  return handleResponse(res);
}

export async function createTask(task) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return handleResponse(res);
}

export async function updateTask(id, task) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return handleResponse(res);
}

export async function finishTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}/finish`, {
    method: "PATCH",
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
