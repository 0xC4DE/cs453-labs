import { Router } from "express";
import { validateLoginUser, validateRegisterUser } from "../middleware/userValidation";
import { loginUser, registerUser } from "../services/userService";
import { authenticateToken } from "../middleware/authentication";

export const userRoutes = Router();

userRoutes.post("/register", validateRegisterUser, async (req, res, next) => {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;

	try {
		const user = await registerUser({ name, email, password });
		res.status(201).json(user);
	} catch (error) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			error.code === "23505" // This detects UNIQUE error
		) {
			return res.status(409).json({
				error: "Email already in use",
			});
		}

		next(error);
	}
});

userRoutes.post("/login", validateLoginUser, async (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	try {
		const session = await loginUser({ email, password });
		if (!session) {
			return res.status(401).json({
				error: "Unauthorized",
				message: "Invalid email or password.",
			});
		}

		res.json(session);
	} catch (error) {
		next(error);
	}
});

userRoutes.get("/me", authenticateToken, async (req, res, next) => {
    res.json({ user: req.user })
});