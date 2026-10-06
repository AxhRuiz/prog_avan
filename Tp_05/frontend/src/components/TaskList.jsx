const PRIORITY_COLORS = {
  Baja: "#8bc34a",
  Media: "#ffc107",
  Alta: "#ff9800",
  Crítica: "#f44336",
};

export default function TaskList({ tasks, onEdit, onDelete, onFinish }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No hay tareas cargadas todavía.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div className={`task-card ${task.status === "Completada" ? "done" : ""}`} key={task.id}>
          <div className="task-card-header">
            <span className="task-id">#{task.id}</span>
            <span
              className="priority-badge"
              style={{ backgroundColor: PRIORITY_COLORS[task.priority] || "#999" }}
            >
              {task.priority}
            </span>
            <span className="status-badge">{task.status}</span>
          </div>

          <h3>{task.summary}</h3>
          <p className="task-project">
            {task.project_name} · {task.activity_type} · Sprint: {task.sprint || "-"}
          </p>

          {task.description && <p className="task-description">{task.description}</p>}

          <div className="task-meta">
            <span>👤 Asignado: {task.assignee}</span>
            <span>🗣 Informador: {task.reporter}</span>
            <span>📅 Creación: {task.creation_date?.slice(0, 10)}</span>
            {task.closing_date && <span>✅ Cierre: {task.closing_date.slice(0, 10)}</span>}
          </div>

          {task.precondition && (
            <p className="task-precondition">
              <strong>Precondición:</strong> {task.precondition}
            </p>
          )}

          <div className="task-actions">
            <button onClick={() => onEdit(task)}>Editar</button>
            {task.status !== "Completada" && (
              <button className="success" onClick={() => onFinish(task.id)}>
                Finalizar
              </button>
            )}
            <button className="danger" onClick={() => onDelete(task.id)}>
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
