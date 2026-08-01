import { Router } from "express";
import { authenticateToken, AuthenticatedUser } from "../middleware/authentication";
import {
	requireProjectOwnerForTaskCreationOrAdmin,
	requireTaskManagerOrAdmin,
} from "../middleware/authorization";
import {
	validateCreateTask,
	validatePatchTask,
	validateTaskId,
} from "../middleware/taskValidation";
import {
	createTask,
	deleteTaskById,
	getTaskByIdForUser,
	listTasksForUser,
	updateTaskById,
} from "../services/taskService";

export const taskRoutes = Router();

taskRoutes.get("/", authenticateToken, async (req, res, next) => {
	const user = req.user as AuthenticatedUser;
	const userId = Number(user.sub);

	try {
		const tasks = await listTasksForUser(userId, user.role);
		res.json(tasks);
	} catch (error) {
		next(error);
	}
});

taskRoutes.post(
	"/",
	authenticateToken,
	validateCreateTask,
	requireProjectOwnerForTaskCreationOrAdmin,
	async (req, res, next) => {
	const title = req.body.title;
	const description = req.body.description;
	const status = req.body.status;
	const projectId = req.body.project_id;
	const assignedTo = req.body.assigned_to;
	const user = req.user as AuthenticatedUser;

	try {
		const task = await createTask({
			title,
			description,
			status,
			project_id: projectId,
			assigned_to: assignedTo,
		});
		res.status(201).json(task);
	} catch (error) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			error.code === "23503" // this is the conflict ID for/from postgres
		) {
			return res.status(400).json({
				error: "Invalid relation",
				message:
					"project_id or assigned_to does not reference an existing record."
			});
		}

		next(error);
	}
},
);

taskRoutes.get("/:id", authenticateToken, validateTaskId, async (req, res, next) => {
	const id = Number(req.params.id);
	const user = req.user as AuthenticatedUser;
	const userId = Number(user.sub);

	try {
		const task = await getTaskByIdForUser(id, userId, user.role);
		if (!task) {
			return res.status(404).json({
				error: "Task not found",
			});
		}

		res.json(task);
	} catch (error) {
		next(error);
	}
});

taskRoutes.patch(
	"/:id",
	authenticateToken,
	validateTaskId,
	validatePatchTask,
	requireTaskManagerOrAdmin,
	async (req, res, next) => {
	const id = Number(req.params.id);
	const title = req.body.title;
	const description = req.body.description;
	const status = req.body.status;
	const assignedTo = req.body.assigned_to;

	try {
		const task = await updateTaskById(id, { title, description, status, assigned_to: assignedTo });
		if (!task) {
			return res.status(404).json({
				error: "Task not found",
			});
		}

		res.json(task);
	} catch (error) {
		next(error);
	}
},
);

taskRoutes.delete(
	"/:id",
	authenticateToken,
	validateTaskId,
	requireTaskManagerOrAdmin,
	async (req, res, next) => {
	const id = Number(req.params.id);

	try {
		const deleted = await deleteTaskById(id);
		if (!deleted) {
			return res.status(404).json({
				error: "Task not found",
			});
		}

		res.status(204).send();
	} catch (error) {
		next(error);
	}
},
);
