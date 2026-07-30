import { NextFunction, Request, Response } from "express";
import { getProjectById } from "../services/projectService";
import { getTaskById } from "../services/taskService";

function getRequesterId(req: Request) {
	const id = Number(req.user?.sub);
	return Number.isInteger(id) && id > 0 ? id : null;
}

export function requireRole(...roles: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res.status(403).json({
				error: "Forbidden",
				message: `This action requires one of these roles: ${roles.join(", ")}.`,
			});
		}

		next();
	};
}

export async function requireProjectOwnerOrAdmin(req: Request, res: Response, next: NextFunction) {
	if (!req.user) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	if (req.user.role === "admin") {
		return next();
	}

	const requesterId = getRequesterId(req);
	if (!requesterId) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const projectId = Number(req.params.id);
	const project = await getProjectById(projectId);
	if (!project) {
		return res.status(404).json({ error: "Project not found" });
	}

	if (project.owner_id !== requesterId) {
		return res.status(403).json({
			error: "Forbidden",
			message: "You can only modify projects you own.",
		});
	}

	next();
}

export async function requireTaskManagerOrAdmin(req: Request, res: Response, next: NextFunction) {
	if (!req.user) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	if (req.user.role === "admin") {
		return next();
	}

	const requesterId = getRequesterId(req);
	if (!requesterId) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const taskId = Number(req.params.id);
	const task = await getTaskById(taskId);
	if (!task) {
		return res.status(404).json({ error: "Task not found" });
	}

	const canManage = task.assigned_to === requesterId || task.project_owner_id === requesterId;
	if (!canManage) {
		return res.status(403).json({
			error: "Forbidden",
			message: "You can only modify tasks you are assigned to or manage through project ownership.",
		});
	}

	next();
}

export async function requireProjectOwnerForTaskCreationOrAdmin(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (!req.user) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	if (req.user.role === "admin") {
		return next();
	}

	const requesterId = getRequesterId(req);
	if (!requesterId) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const projectId = Number(req.body?.project_id);
	const project = await getProjectById(projectId);
	if (!project) {
		return res.status(404).json({ error: "Project not found" });
	}

	if (project.owner_id !== requesterId) {
		return res.status(403).json({
			error: "Forbidden",
			message: "You can only create tasks in projects you own.",
		});
	}

	next();
}