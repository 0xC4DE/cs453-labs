import { Router } from "express";
import {
	validateCreateTask,
	validatePatchTask,
	validateTaskId,
} from "../middleware/taskValidation";
import {
	createTask,
	deleteTaskById,
	getTaskById,
	listTasks,
	updateTaskById,
} from "../services/taskService";

export const taskRoutes = Router();

taskRoutes.get("/", async (_req, res, next) => {
	try {
		const tasks = await listTasks();
		res.json(tasks);
	} catch (error) {
		next(error);
	}
});

taskRoutes.post("/", validateCreateTask, async (req, res, next) => {
	const title = req.body.title;
	const description = req.body.description;
	const status = req.body.status;

	try {
		const task = await createTask({ title, description, status });
		res.status(201).json(task);
	} catch (error) {
		next(error);
	}
});

taskRoutes.get("/:id", validateTaskId, async (req, res, next) => {
	const id = Number(req.params.id);

	try {
		const task = await getTaskById(id);
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

taskRoutes.patch("/:id", validateTaskId, validatePatchTask, async (req, res, next) => {
	const id = Number(req.params.id);
	const title = req.body.title;
	const description = req.body.description;
	const status = req.body.status;

	try {
		const task = await updateTaskById(id, { title, description, status });
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

taskRoutes.delete("/:id", validateTaskId, async (req, res, next) => {
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
});
