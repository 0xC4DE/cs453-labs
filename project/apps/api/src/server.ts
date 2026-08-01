import express from "express";
import { env } from "./config/env";
import { pool } from "./db/pool";
import { registerUser } from "./services/userService";
const { projectRoutes } = require("./routes/projectRoutes");
const { taskRoutes } = require("./routes/taskRoutes");
const { userRoutes } = require("./routes/userRoutes");
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

async function createDefaultUsers() {
	// Will only work if the users are not already created
	try {
		await registerUser({name: "admin", email: "admin@example.com", password: "password"});
	} catch (error) { console.log("Admin user possibly already exists, skipping creation.") };

	try {
		await registerUser({name: "user1", email: "user1@example.com", password: "password"});
	} catch (error) { console.log("User1 possibly already exists, skipping creation.") };

	// Will always work if the admin@example.com exists, so shouldn't crash
	await pool.query(`UPDATE users SET role = 'admin' WHERE email = $1`, ["admin@example.com"]);
}

app.use(express.json());
app.use("/projects", projectRoutes);
app.use("/auth", userRoutes);
app.use("/tasks", taskRoutes);

app.get("/health", (_req, res) => {
	res.json({
		status: "ok",
		service: "cs453-api",
	});
});

app.get("/db-health", async (_req, res) => {
	try {
		const result = await pool.query("SELECT NOW() AS current_time");
		res.json({
			status: "ok",
			database: "connected",
			currentTime: result.rows[0].current_time,
		});
	} catch (error) {
		console.error("Database health check failed:", error);
		res.status(500).json({
			status: "error",
			database: "disconnected",
		});
	}
});

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
	try {
		// NOTE: If this were a production application, I would not create default users on every startup.

		await createDefaultUsers();

		app.listen(env.port, () => {
			console.log(`Server running at http://localhost:${env.port}`);
		});
	} catch (error) {
		console.error("Server startup failed:", error);
		process.exit(1);
	}
}

startServer();
