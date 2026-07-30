import { pool } from "../db/pool";

export type Project = {
	id: number;
	name: string;
	description: string | null;
	owner_id: number;
	created_at: string;
};

export type ProjectInput = {
	name: string;
	description?: string | null;
	ownerId: number;
};

export type UpdateProjectInput = {
	name?: string;
	description?: string | null;
};

export async function listProjects() {
	const result = await pool.query<Project>(
		`SELECT id,
		        name,
		        description,
		        owner_id,
		        created_at
		 FROM projects
		 ORDER BY id`,
	);

	return result.rows;
}

export async function getProjectById(id: number) {
	const result = await pool.query<Project>(
		`SELECT id,
		        name,
		        description,
		        owner_id,
		        created_at
		 FROM projects
		 WHERE id = $1`,
		[id],
	);

	return result.rows[0] ?? null;
}

export async function createProject(input: ProjectInput) {
	const name = input.name.trim();
	const description = input.description?.trim();

	const result = await pool.query<Project>(
		`INSERT INTO projects (name, description, owner_id)
		 VALUES ($1, $2, $3)
		 RETURNING id,
		           name,
		           description,
		           owner_id,
		           created_at`,
		[name, description || null, input.ownerId],
	);

	return result.rows[0];
}

export async function updateProjectById(id: number, input: UpdateProjectInput) {
	const existing = await getProjectById(id);
	if (!existing) {
		return null;
	}

	const nextName = (input.name ?? existing.name).trim();
	const nextDescription = (input.description ?? existing.description ?? "").trim();

	const result = await pool.query<Project>(
		`UPDATE projects
		 SET name = $1,
		     description = $2
		 WHERE id = $3
		 RETURNING id,
		           name,
		           description,
		           owner_id,
		           created_at`,
		[nextName, nextDescription || null, id],
	);

	return result.rows[0];
}

export async function deleteProjectById(id: number) {
	const result = await pool.query<{ id: number }>(
		`DELETE FROM projects
		 WHERE id = $1
		 RETURNING id`,
		[id],
	);

	return result.rows.length === 1;
}