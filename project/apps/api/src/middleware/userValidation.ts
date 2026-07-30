import { NextFunction, Request, Response } from "express";

export function validateRegisterUser(req: Request, res: Response, next: NextFunction) {
	const name = req.body?.name;
	const email = req.body?.email;
	const password = req.body?.password;

	if (typeof name !== "string" || name.trim().length === 0) {
		return res.status(400).json({ error: "name is required" });
	}

	if (typeof email !== "string" || email.trim().length === 0) {
		return res.status(400).json({ error: "email is required" });
	}

	if (typeof password !== "string" || password.length === 0) {
		return res.status(400).json({ error: "password is required" });
	}

	next();
}

export function validateLoginUser(req: Request, res: Response, next: NextFunction) {
	const email = req.body?.email;
	const password = req.body?.password;

	if (typeof email !== "string" || email.trim().length === 0) {
		return res.status(400).json({ error: "email is required" });
	}

	if (typeof password !== "string" || password.length === 0) {
		return res.status(400).json({ error: "password is required" });
	}

	next();
}