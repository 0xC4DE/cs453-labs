# CS453/553 Client-Server Architecture Project

This section of the repository was copied from the **starter template** for the semester project in  
**CS453 / CS553 – Client/Server Architectures**.

# Development Setup

## 1. Clone the repository

```shell
git clone <your-repository-url>
cd cs453-project-template
```

## 2. Start the database

This project uses Docker to run PostgreSQL locally.

```shell
docker-compose up -d
```

This will start a PostgreSQL database container.

---

## 3. Install dependencies

```shell
cd apps/api
npm install
```

## 4. Database Schema setup
```shell
psql postgresql://postgres:postgres@localhost:5432/cs453 -f database/schema.sql
```
Any settings for database authentication is controlled by the `docker-compose.yml`. The environment sections control the
Optionally a .env file inside of `project` can be created with `DATABASE_URL` set to a different credential.

---

## 5. Run the server
```shell
npm run dev
```

The API server should start locally.

## 6. Running tests
```shell
node apps/client/client.js
```

---

# Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | /tasks | Return all tasks |
| POST | /tasks | Create a new task |
| GET | /tasks/:id | Return one task by ID |
| PATCH | /tasks/:id | Update an existing task |
| DELETE | /tasks/:id | Delete an existing task |


# Reflection Questions

What is the difference between an in-memory API and a database-backed API?

- In-memory will go away if the server ever restarts. Dayata-base backed will never disappear unless deleted. Database also requires drivers to connect to it while in-memory generally doesn't.

Why is it useful to separate routes, services, and database logic?

- Separating routes, services, and database logic just allows you to keep code segmented while maintaining functionality. If one segment of this code fails it becomes much easier to track exactly where it's going wrong, and reduces repeated code in the process.

What HTTP status codes did you use, and why?

- 500 health check failed/internal server error, 400 bad form content (bad request, bad json), 404 item/task not found, 200 regular success, 201 created a task, 204 no content for when a task is deleted. I used all of these as they are the recommended defaults for the type of response that they provide for.

What happens when a client requests a task ID that does not exist?

- They will 404 because the routes check for the item to exist before executing anything.

What was the hardest part of connecting the API to PostgreSQL?

- The queries are the hardest part, as they must be templated as to prevent injection and they must be raw queries. This is generally solved with an ORM library that wraps database operations into programmatic function calls/object manipulations.
