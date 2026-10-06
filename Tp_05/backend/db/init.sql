CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Pendiente',
  summary VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  priority VARCHAR(50) NOT NULL DEFAULT 'Media',
  reporter VARCHAR(150) NOT NULL,
  assignee VARCHAR(150) NOT NULL,
  precondition TEXT DEFAULT '',
  creation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  closing_date DATE,
  sprint VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

INSERT INTO tasks (
  project_name, activity_type, status, summary, description, priority,
  reporter, assignee, precondition, creation_date, sprint
) VALUES
(
  'Sistema de Gestión Académica', 'Feature', 'Pendiente',
  'Crear endpoint de login', 'Implementar autenticación JWT para el módulo de alumnos.',
  'Alta', 'Ernesto Ledesma', 'Axel Ruiz', 'Tener el modelo de usuarios listo',
  CURRENT_DATE, 'Sprint 1'
),
(
  'Sistema de Gestión Académica', 'Bug', 'En progreso',
  'Corregir cálculo de promedio', 'El promedio no contempla materias recursadas.',
  'Crítica', 'Axel Ruiz', 'Axel Ruiz', 'Acceso a la base de notas',
  CURRENT_DATE, 'Sprint 1'
);
