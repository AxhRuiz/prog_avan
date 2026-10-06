import express from "express";
import cors from "cors";
import pkg from "pg";

const { Pool } = pkg;

const PORT = process.env.PORT || 3002;

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

const app = express();
app.use(cors());
app.use(express.json());

// Campos que acepta el formulario / la tabla tasks
const FIELDS = [
  "project_name",
  "activity_type",
  "status",
  "summary",
  "description",
  "priority",
  "reporter",
  "assignee",
  "precondition",
  "creation_date",
  "closing_date",
  "sprint",
];

function validateRequired(body) {
  const required = [
    "project_name",
    "activity_type",
    "summary",
    "reporter",
    "assignee",
  ];
  const missing = required.filter((f) => !body[f] || String(body[f]).trim() === "");
  return missing;
}

// GET /tasks  (filtro opcional ?status=... y ?project_name=...)
app.get("/tasks", async (req, res) => {
  try {
    const { status, project_name } = req.query;
    const conditions = [];
    const values = [];

    if (status) {
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }
    if (project_name) {
      values.push(project_name);
      conditions.push(`project_name = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const { rows } = await pool.query(
      `SELECT * FROM tasks ${where} ORDER BY id`,
      values
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al listar tareas" });
  }
});

// GET /tasks/:id
app.get("/tasks/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM tasks WHERE id = $1", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener la tarea" });
  }
});

// POST /tasks
app.post("/tasks", async (req, res) => {
  try {
    const missing = validateRequired(req.body);
    if (missing.length > 0) {
      return res
        .status(400)
        .json({ error: `Faltan campos obligatorios: ${missing.join(", ")}` });
    }

    const {
      project_name,
      activity_type,
      status = "Pendiente",
      summary,
      description = "",
      priority = "Media",
      reporter,
      assignee,
      precondition = "",
      creation_date,
      closing_date = null,
      sprint = "",
    } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO tasks
        (project_name, activity_type, status, summary, description, priority,
         reporter, assignee, precondition, creation_date, closing_date, sprint)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, COALESCE($10, CURRENT_DATE), $11, $12)
       RETURNING *`,
      [
        project_name,
        activity_type,
        status,
        summary,
        description,
        priority,
        reporter,
        assignee,
        precondition,
        creation_date || null,
        closing_date,
        sprint,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la tarea" });
  }
});

// PUT /tasks/:id  (edición: solo pisa los campos recibidos)
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const setClauses = [];
    const values = [];

    FIELDS.forEach((field) => {
      if (body[field] !== undefined) {
        values.push(body[field]);
        setClauses.push(`${field} = $${values.length}`);
      }
    });

    if (setClauses.length === 0) {
      return res.status(400).json({ error: "No se enviaron campos para actualizar" });
    }

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE tasks SET ${setClauses.join(", ")}, updated_at = now()
       WHERE id = $${values.length}
       RETURNING *`,
      values
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar la tarea" });
  }
});

// PATCH /tasks/:id/finish  (marca la tarea como Completada + fecha de cierre)
app.patch("/tasks/:id/finish", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE tasks
       SET status = 'Completada',
           closing_date = COALESCE(closing_date, CURRENT_DATE),
           updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al finalizar la tarea" });
  }
});

// DELETE /tasks/:id
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar la tarea" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Task Manager API escuchando en http://localhost:${PORT}`);
  console.log(`📋 Endpoints disponibles en /tasks`);
});
