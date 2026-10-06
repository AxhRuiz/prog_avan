import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import { getTasks, createTask, updateTask, deleteTask, finishTask } from "./api.js";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setError("");
    } catch (err) {
      setError("No se pudieron cargar las tareas. ¿Está el backend levantado?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleSubmit(taskData) {
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, taskData);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setEditingTask(null);
      } else {
        const created = await createTask(taskData);
        setTasks((prev) => [...prev, created]);
      }
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("¿Seguro que querés eliminar esta tarea?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (editingTask?.id === id) setEditingTask(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleFinish(id) {
    try {
      const updated = await finishTask(id);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>📋 Task Manager — Gestión de Tareas de Proyectos</h1>
      </header>

      {error && <div className="global-error">{error}</div>}

      <main>
        <TaskForm
          editingTask={editingTask}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditingTask(null)}
        />

        <section>
          <div className="list-header">
            <h2>Listado de Tareas</h2>
            <button className="secondary" onClick={loadTasks}>Actualizar</button>
          </div>
          {loading ? (
            <p>Cargando tareas...</p>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              onFinish={handleFinish}
            />
          )}
        </section>
      </main>
    </div>
  );
}
