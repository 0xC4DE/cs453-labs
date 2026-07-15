import { pool } from "../db/pool";

export type Task = {
	id: number;
	title: string;
	description: string | null;
	status: string;
	created_at: string;
	updated_at: string;
};

export type TaskInput = {
	title: string;
	description?: string;
	status?: string;
};

export async function listTasks() {
	const result = await pool.query<Task>(
        `SELECT id,
                title,
                description,
                status,
                created_at,
                updated_at
         FROM tasks ORDER BY id`
    )
	return result.rows;
}

export async function getTaskById(id: number) {
	const result = await pool.query<Task>(
        `SELECT id,
                title,
                description,
                status,
                created_at,
                updated_at
         FROM tasks WHERE id = $1`, [id]);
	return result.rows[0] ?? null;
}

export async function createTask(input: TaskInput) {
	const title = input.title.trim();
	const description = input.description?.trim();
	const status = input.status?.trim() || "todo";

	const result = await pool.query<Task>(
		`INSERT INTO tasks (title, description, status)
         VALUES ($1, $2, $3)
         RETURNING id,
                   title,
                   description,
                   status,
                   created_at,
                   updated_at`,
		[title, description || null, status],
	);

	return result.rows[0];
}

export async function updateTaskById(id: number, input: TaskInput) {
	const existing = await getTaskById(id);
	if (!existing) {
		return null;
	}

    var nextTitle = existing.title
    var nextDescription = existing.description
    var nextStatus = existing.status

    //  ?? is used as a if null use this type of operator
    nextTitle = (input.title ?? existing.title).trim()
    nextDescription = (input.description ?? existing.description ?? "").trim()
    nextStatus = (input.status ??  existing.status).trim()


	const result = await pool.query<Task>(
		`UPDATE tasks
         SET title = $1,
             description = $2,
             status = $3,
             updated_at = NOW()
         WHERE id = $4
         RETURNING id,
                   title,
                   description,
                   status,
                   created_at,
                   updated_at`,
		[nextTitle, nextDescription, nextStatus, id],
	);

	return result.rows[0];
}

export async function deleteTaskById(id: number) {
	const result = await pool.query<{ id: number }>(
		`DELETE FROM tasks
         WHERE id = $1
         RETURNING id`,
		[id],
	);

	return result.rows.length === 1;
}
