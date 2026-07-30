import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { pool } from "../db/pool";

const jwtExpiresIn = "1h";

export type User = {
	id: number;
	name: string;
	email: string;
	role: string;
	created_at: string;
};

type UserRow = User & {
	password_hash: string;
};

export type RegisterUserInput = {
	name: string;
	email: string;
	password: string;
};

export type LoginUserInput = {
	email: string;
	password: string;
};

export async function registerUser(input: RegisterUserInput) {
	const name = input.name.trim();
	const email = input.email.trim().toLowerCase();
	const passwordHash = await bcrypt.hash(input.password, 10);

	const result = await pool.query<User>(
		`INSERT INTO users (name, email, password_hash, role)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id,
		           name,
		           email,
		           role,
		           created_at`,
		[name, email, passwordHash, "user"],
	);

	return result.rows[0];
}

export async function loginUser(input: LoginUserInput) {
	const email = input.email.trim().toLowerCase();

	const result = await pool.query<UserRow>(
		`SELECT id,
		        name,
		        email,
		        password_hash,
		        role,
		        created_at
		 FROM users
		 WHERE email = $1`,
		[email],
	);

	const user = result.rows[0];
	if (!user || !(await bcrypt.compare(input.password, user.password_hash))) {
		return null;
	}

	const token = jwt.sign(
		{ sub: String(user.id), email: user.email, role: user.role },
		env.jwtSecret,
		{ expiresIn: jwtExpiresIn },
	);

	return {
		accessToken: token,
		tokenType: "Bearer",
		expiresIn: jwtExpiresIn,
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
			created_at: user.created_at,
		},
	};
}