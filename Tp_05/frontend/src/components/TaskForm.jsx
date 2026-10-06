import { useEffect, useState } from "react";

const ACTIVITY_TYPES = ["Feature", "Bug", "Mejora", "Tarea técnica", "Documentación"];
const STATUSES = ["Pendiente", "En progreso", "En revisión", "Completada"];
const PRIORITIES = ["Baja", "Media", "Alta", "Crítica"];

const EMPTY_TASK = {
  project_name: "",
  activity_type: ACTIVITY_TYPES[0],
  status: STATUSES[0],
  summary: "",
  description: "",
  priority: PRIORITIES[1],
  reporter: "",
  assignee: "",
  precondition: "",
  creation_date: new Date().toISOString().slice(0, 10),
  closing_date: "",
  sprint: "",
};

export default function TaskForm({ editingTask, onSubmit, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_TASK);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setForm({
        ...EMPTY_TASK,
        ...editingTask,
        creation_date: editingTask.creation_date?.slice(0, 10) || "",
        closing_date: editingTask.closing_date?.slice(0, 10) || "",
      });
    } else {
      setForm(EMPTY_TASK);
    }
  }, [editingTask]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const required = ["project_name", "activity_type", "summary", "reporter", "assignee"];
    const missing = required.filter((f) => !form[f]?.trim());
    if (missing.length > 0) {
      setError(`Completá los campos obligatorios: ${missing.join(", ")}`);
      return;
    }

    const payload = {
      ...form,
      closing_date: form.closing_date || null,
    };

    onSubmit(payload);
    if (!editingTask) setForm(EMPTY_TASK);
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? `Editar tarea #${editingTask.id}` : "Nueva tarea"}</h2>

      {error && <div className="form-error">{error}</div>}

      <div className="form-grid">
        <label>
          Nombre del Proyecto *
          <input
            name="project_name"
            value={form.project_name}
            onChange={handleChange}
          />
        </label>

        <label>
          Tipo de Actividad *
          <select name="activity_type" value={form.activity_type} onChange={handleChange}>
            {ACTIVITY_TYPES.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        <label>
          Estado
          <select name="status" value={form.status} onChange={handleChange}>
            {STATUSES.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        <label>
          Prioridad
          <select name="priority" value={form.priority} onChange={handleChange}>
            {PRIORITIES.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        <label>
          Informador *
          <input name="reporter" value={form.reporter} onChange={handleChange} />
        </label>

        <label>
          Persona asignada *
          <input name="assignee" value={form.assignee} onChange={handleChange} />
        </label>

        <label>
          Fecha de Creación
          <input
            type="date"
            name="creation_date"
            value={form.creation_date}
            onChange={handleChange}
          />
        </label>

        <label>
          Fecha de Cierre
          <input
            type="date"
            name="closing_date"
            value={form.closing_date}
            onChange={handleChange}
          />
        </label>

        <label>
          Sprint
          <input name="sprint" value={form.sprint} onChange={handleChange} />
        </label>
      </div>

      <label className="full-width">
        Resumen *
        <input name="summary" value={form.summary} onChange={handleChange} />
      </label>

      <label className="full-width">
        Descripción
        <textarea
          name="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
        />
      </label>

      <label className="full-width">
        Precondición
        <textarea
          name="precondition"
          rows={2}
          value={form.precondition}
          onChange={handleChange}
        />
      </label>

      <div className="form-actions">
        <button type="submit">{editingTask ? "Guardar cambios" : "Crear tarea"}</button>
        {editingTask && (
          <button type="button" className="secondary" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
