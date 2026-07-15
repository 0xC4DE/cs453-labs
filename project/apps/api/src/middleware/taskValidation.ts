import { NextFunction, Request, Response } from "express";

function parsePositiveInt(value: string): number | null {
	const id = Number(value);
	if (!Number.isInteger(id) || id <= 0) {
		return null;
	}
	return id;
}

export function validateTaskId(req: Request, res: Response, next: NextFunction) {
	const id = parsePositiveInt(Array.isArray(req.params.id) ? req.params.id.join("") : req.params.id);
	if (!id) {
		return res.status(400).json({ error: "Invalid task id" });
	}
	next();
}

export function validateCreateTask(req: Request, res: Response, next: NextFunction) {
	const title = req.body?.title;
	const description = req.body?.description;
	const status = req.body?.status;

	if (typeof title !== "string" || title.trim().length === 0) {
		return res.status(400).json({ error: "title is required" });
	}

	if (description !== undefined && typeof description !== "string") {
		return res.status(400).json({ error: "description must be a string" });
	}

	if (status !== undefined && (typeof status !== "string" || status.trim().length === 0)) {
		return res.status(400).json({ error: "status must be a non-empty string" });
	}

	next();
}

export function validatePatchTask(req: Request, res: Response, next: NextFunction) {
	const title = req.body?.title;
	const description = req.body?.description;
	const status = req.body?.status;

	if (title === undefined && description === undefined && status === undefined) {
		return res.status(400).json({ error: "At least one field is required" });
	}

	if (title !== undefined && (typeof title !== "string" || title.trim().length === 0)) {
		return res.status(400).json({ error: "title must be a non-empty string" });
	}

	if (description !== undefined && description !== null && typeof description !== "string") {
		return res.status(400).json({ error: "description must be a string or null" });
	}

	if (status !== undefined && (typeof status !== "string" || status.trim().length === 0)) {
		return res.status(400).json({ error: "status must be a non-empty string" });
	}

	next();
}
