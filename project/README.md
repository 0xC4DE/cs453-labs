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
Any settings for database authentication can be controlled by the `docker-compose.yml`.
A .env file (specified below) inside of `project` can be created with `DATABASE_URL` set to a different credential
it's also important to set `JWT_SECRET` inside of the docker-compose

## 5. .env setup and running the server

Optionally, Create a `.env` file in `project/` using the example file:

```shell
cp .env.example .env
```

```

Start the server from the project root:

```shell
npm run dev
```

On startup, default users are created if missing and `admin@example.com` is promoted to role `admin`.

The API server should start locally.
NOTE: an administrator and "user1" account will be created upon server startup.

## 6. Running tests
```shell
node apps/client/client.js
```

---

## 7. Registration API & Login API
```shell
curl -X POST http://localhost:3000/auth/register \
	-H "Content-Type: application/json" \
	-d '{
		"name": "user2",
		"email": "user2@example.com",
		"password": "password"
	}'

curl -X POST http://localhost:3000/auth/login \
	-H "Content-Type: application/json" \
	-d '{
		"email": "user2@example.com",
		"password": "password"
	}'
```

---

## 8. How to use your token
Include the "Authorization: Bearer {token}" header in your request

ex: 
```shell
curl -X GET http://localhost:3000/tasks \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer {TOKEN}"
```


# Routes

| Method | Route | Protected | Who can access |
| --- | --- | --- | --- |
| GET | /health | No | Public health check |
| GET | /db-health | No | Public DB connectivity check |
| POST | /auth/register | No | Public registration |
| POST | /auth/login | No | Public login |
| GET | /auth/me | Yes | Any authenticated user |
| GET | /projects | Yes | Admin sees all; user sees owned projects |
| POST | /projects | Yes | Any authenticated user can create |
| GET | /projects/:id | Yes | Admin any project; user only owned project |
| PATCH | /projects/:id | Yes | Admin any project; user only owned project |
| DELETE | /projects/:id | Yes | Admin any project; user only owned project |
| GET | /projects/admin/all | Yes | Admin only |
| GET | /tasks | Yes | Admin sees all; user sees assigned tasks or tasks in owned projects |
| POST | /tasks | Yes | Admin any project; user only in owned projects |
| GET | /tasks/:id | Yes | Admin any task; user only assigned task or task in owned project |
| PATCH | /tasks/:id | Yes | Admin any task; user only assigned task or task in owned project |
| DELETE | /tasks/:id | Yes | Admin any task; user only assigned task or task in owned project |

# Reflection Questions

1) What is the difference between authentication and authorization?

Authentication means "proving who you say you are" this is proven in an application with a username/password pair. Authorization is more or less the question of "What is this person allowed to access."

2) Why should passwords be hashed instead of stored directly?

Hashes are non-reversible, and storing plaintext passwords can result in leakage of private data (the password)

3) What information did you include in your JWT, and why?

User ID, Email, Role. I included UserID and Role for easy look up against the user without having to make excessive SQL queries. I included email because it was part of the specification.

4) What is the difference between a 401 response and a 403 response?

401 means unauthorized 403 means forbidden. A 401 is used when you dont have the credential inside of the request, or that credential is expired. 403 is used when your credential is valid but you just dont have access to that particular resource.

5) Where does your application perform role or ownership checks?

A combination of queries inside of project & taks services, and also inside of authorization.ts. It is done in the services because it can cut down on server-side filtering for returning several items and inside of the authorization.ts where it is easier to simply apply a top-level filter against a single entry.

6) How are users, projects, and tasks related in your database?

Users exist, projects can have owners which are users, tasks can belong to projects and be assigned to users.

7) What was the hardest part of adding authentication or authorization?

Authorization is a notoriously difficult problem because there are several cases to consider and it can be more difficult to generalize things instead of simply making different handlers for different types.

