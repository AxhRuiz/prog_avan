# Task Manager — React + Node/Express + PostgreSQL (Docker)

Formulario y listado de tareas de proyectos de software, con persistencia en
PostgreSQL. Frontend, backend y base de datos corren cada uno en su propio
contenedor Docker, orquestados con Docker Compose.

## Estructura

```
task-manager/
  backend/        API REST (Node + Express + pg)
  frontend/       React + Vite, servido con Nginx en producción
  docker-compose.yml
  .env.example
```

## Cómo levantar el proyecto

```bash
cp .env.example .env
docker compose up --build
```

- Frontend: http://localhost:8080
- API: http://localhost:3002/tasks
- Postgres: localhost:5432 (user/pass en `.env`)

## Campos del formulario

Nombre del Proyecto, Tipo de Actividad, Estado, Resumen, Descripción,
Prioridad, Informador, Persona asignada, Precondición, Fecha de Creación,
Fecha de Cierre, Sprint.

Campos obligatorios: Nombre del Proyecto, Tipo de Actividad, Resumen,
Informador, Persona asignada.

## Funcionalidad

- **Crear** tarea desde el formulario.
- **Listado de Tareas**: muestra todas las tareas con sus datos.
- **Editar**: carga la tarea en el formulario y permite modificarla (PUT).
- **Eliminar**: borra la tarea (DELETE), con confirmación.
- **Finalizar**: cambia el estado a "Completada" y setea la fecha de cierre
  automáticamente si no tenía una (PATCH `/tasks/:id/finish`).

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/tasks` | Lista todas las tareas (filtros opcionales `?status=` y `?project_name=`) |
| GET | `/tasks/:id` | Obtiene una tarea |
| POST | `/tasks` | Crea una tarea |
| PUT | `/tasks/:id` | Edita una tarea (solo pisa los campos enviados) |
| PATCH | `/tasks/:id/finish` | Marca la tarea como Completada |
| DELETE | `/tasks/:id` | Elimina una tarea |

## Desarrollo local sin Docker (opcional)

Backend:
```bash
cd backend
npm install
# definir PGHOST=localhost, PGUSER, PGPASSWORD, PGDATABASE, PORT en variables de entorno
npm start
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```
