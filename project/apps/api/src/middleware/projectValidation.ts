import { NextFunction, Request, Response } from "express";

function parsePositiveInt(value: string): number | null {
	const id = Number(value);
	if (!Number.isInteger(id) || id <= 0) {
		return null;
	}
	return id;
}

export function validateProjectId(req: Request, res: Response, next: NextFunction) {
	const id = parsePositiveInt(Array.isArray(req.params.id) ? req.params.id.join("") : req.params.id);
	if (!id) {
		return res.status(400).json({ error: "Invalid project id" });
	}
	next();
}

export function validateCreateProject(req: Request, res: Response, next: NextFunction) {
	const name = req.body?.name;
	const description = req.body?.description;

	if (typeof name !== "string" || name.trim().length === 0) {
		return res.status(400).json({ error: "name is required" });
	}

	if (description !== undefined && description !== null && typeof description !== "string") {
		return res.status(400).json({ error: "description must be a string or null" });
	}

	next();
}

export function validatePatchProject(req: Request, res: Response, next: NextFunction) {
	const name = req.body?.name;
	const description = req.body?.description;

	if (name === undefined && description === undefined) {
		return res.status(400).json({ error: "At least one field is required" });
	}

	if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
		return res.status(400).json({ error: "name must be a non-empty string" });
	}

	if (description !== undefined && description !== null && typeof description !== "string") {
		return res.status(400).json({ error: "description must be a string or null" });
	}

	next();
}