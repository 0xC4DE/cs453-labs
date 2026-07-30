import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type AuthenticatedUser = JwtPayload & {
	sub: string;
	username: string;
    email: string;
	role: string;
};

// Needed because this is based in typescript, and the Request needs user
// to be able to resolve user on authenticated endpoints
declare global {
	namespace Express {
		interface Request {
			user?: AuthenticatedUser;
		}
	}
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
	const authorization = req.get("authorization");

	if (!authorization?.startsWith("Bearer ")) {
		return res.status(401).json({
			error: "Unauthorized",
			message: "Bearer token not included with request.",
		});
	}

	const token = authorization.slice("Bearer ".length);

	try {
		req.user = jwt.verify(token, env.jwtSecret) as AuthenticatedUser;
		next();
	} catch {
		return res.status(401).json({
			error: "Unauthorized",
			message: "The access token is missing, invalid, or expired.",
		});
	}
}