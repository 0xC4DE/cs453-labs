import { pool } from "../db/pool";

export type Task = {
	id: number;
	title: string;
	description: string | null;
	status: string;
    project_id: number;
    assigned_to: number | null;
    project_owner_id: number;
	created_at: string;
	updated_at: string;
};

export type TaskInput = {
	title: string;
	description?: string;
	status?: string;
    project_id: number;
    assigned_to?: number | null;
};

export type UpdateTaskInput = {
    title?: string;
    description?: string | null;
    status?: string;
    assigned_to?: number | null;
};

type Role = "user" | "admin";

export async function listTasks() {
	const result = await pool.query<Task>(
        `SELECT t.id,
                t.title,
                t.description,
                t.status,
                t.project_id,
                t.assigned_to,
                p.owner_id AS project_owner_id,
                t.created_at,
                t.updated_at
         FROM tasks t
         INNER JOIN projects p ON p.id = t.project_id
         ORDER BY t.id`,
    );
	return result.rows;
}

export async function listTasksForUser(userId: number, role: Role) {
    if (role === "admin") {
        return listTasks();
    }

    const result = await pool.query<Task>(
        `SELECT t.id,
                t.title,
                t.description,
                t.status,
                t.project_id,
                t.assigned_to,
                p.owner_id AS project_owner_id,
                t.created_at,
                t.updated_at
         FROM tasks t
         INNER JOIN projects p ON p.id = t.project_id
         WHERE p.owner_id = $1
            OR t.assigned_to = $1
         ORDER BY t.id`,
        [userId],
    );

    return result.rows;
}

export async function getTaskById(id: number) {
    const result = await pool.query<Task>(
        `SELECT t.id,
                t.title,
                t.description,
                t.status,
                t.project_id,
                t.assigned_to,
                p.owner_id AS project_owner_id,
                t.created_at,
                t.updated_at
         FROM tasks t
         INNER JOIN projects p ON p.id = t.project_id
         WHERE t.id = $1`,
        [id],
    );

    return result.rows[0] ?? null;
}

export async function getTaskByIdForUser(id: number, userId: number, role: Role) {
    if (role === "admin") {
        return getTaskById(id);
    }

    const result = await pool.query<Task>(
        `SELECT t.id,
                t.title,
                t.description,
                t.status,
                t.project_id,
                t.assigned_to,
                p.owner_id AS project_owner_id,
                t.created_at,
                t.updated_at
         FROM tasks t
         INNER JOIN projects p ON p.id = t.project_id
         WHERE t.id = $1
                     AND (p.owner_id = $2 OR t.assigned_to = $2)`,
        [id, userId],
    );

    return result.rows[0] ?? null;
}

export async function createTask(input: TaskInput) {
    const title = input.title.trim();

    let description: string | null = null;
    if (input.description !== undefined) {
        const trimmedDescription = input.description.trim();
        if (trimmedDescription.length > 0) {
            description = trimmedDescription;
        }
    }

    let status = "todo";
    if (input.status !== undefined) {
        const trimmedStatus = input.status.trim();
        if (trimmedStatus.length > 0) {
            status = trimmedStatus;
        }
    }

    let assignedTo: number | null = null;
    if (input.assigned_to !== undefined) {
        assignedTo = input.assigned_to;
    }

    const insertResult = await pool.query<{ id: number }>(
        `INSERT INTO tasks (title, description, status, project_id, assigned_to)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [title, description, status, input.project_id, assignedTo],
    );

    const created = await getTaskById(insertResult.rows[0].id);
    if (!created) {
        throw new Error("Failed to load created task");
    }

    return created;
}

export async function updateTaskById(id: number, input: UpdateTaskInput) {
    const existing = await getTaskById(id);
    if (!existing) {
        return null;
    }

    let nextTitle = existing.title;
    if (input.title !== undefined) {
        nextTitle = input.title.trim();
    }

    let nextDescription = existing.description;
    if (input.description !== undefined) {
        if (input.description === null) {
            nextDescription = null;
        } else {
            nextDescription = input.description.trim();
        }
    }

    let nextStatus = existing.status;
    if (input.status !== undefined) {
        nextStatus = input.status.trim();
    }

    let nextAssignedTo = existing.assigned_to;
    if (input.assigned_to !== undefined) {
        nextAssignedTo = input.assigned_to;
    }

    const updateResult = await pool.query<{ id: number }>(
        `UPDATE tasks
         SET title = $1,
             description = $2,
             status = $3,
             assigned_to = $4,
             updated_at = NOW()
         WHERE id = $5
         RETURNING id`,
        [nextTitle, nextDescription, nextStatus, nextAssignedTo, id],
    );

    if (updateResult.rows.length === 0) {
        return null;
    }

    return getTaskById(updateResult.rows[0].id);
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
