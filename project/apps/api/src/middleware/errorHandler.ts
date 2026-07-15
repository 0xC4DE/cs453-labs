import { NextFunction, Request, Response } from "express";

export function notFoundHandler(_req: Request, res: Response, _next: NextFunction) {
	res.status(404).json({ error: "Not found" });
}

export function errorHandler(
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (error instanceof SyntaxError && "status" in error) {
		return res.status(400).json({ error: "Invalid JSON payload" });
	}

	console.error("Unhandled server error:", error);
	res.status(500).json({ error: "Internal server error" });
}
