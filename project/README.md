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
