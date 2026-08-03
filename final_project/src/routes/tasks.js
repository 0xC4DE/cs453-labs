import { Router } from 'express';
import { db } from '../database.js';
import {
  authenticateToken,
  requireRole
} from "../middleware/auth.js";

export const tasksRouter = Router();

tasksRouter.get(
    "/",
    // DONE (PART 3): Replace part3NotImplemented with the required
    // authentication and role-authorization middleware.
    authenticateToken,
    requireRole("student", "instructor"),
    (req, res) => {
      // This part was not in the spec.
      return res.json({
        userId: req.user.sub,
        tasks: [],
      })
    }
);

tasksRouter.get('/:id',
    // DONE (PART 4): Add the required authentication and authorization middleware.
    authenticateToken,
    requireRole("student", "instructor"),
    async (req, res, next) => {
      const id = req.params.id
      try {
        // DONE (PART 4): Query req.params.id with parameterized SQL using db.query(sql, parameters).
        const result = await db.query(
          "SELECT id, title, course, student_id AS studentId, completed FROM tasks WHERE id = ?",
          [id]
        );

        // DONE (PART 4): Return 404 when no task exists, allow instructors, and check student ownership.
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "Task not found." });
        }

        if (req.user.role === "instructor") {
          return res.json({
            id: result.rows[0].id,
            title: result.rows[0].title,
            course: result.rows[0].course,
            completed: Boolean(result.rows[0].completed),
          });
        }

        // DONE (PART 4): Return 403 for another student's task; return the task on success.
        if (req.user.role === "student" && result.rows[0].studentId !== req.user.sub) {
          return res.status(403).json({ error: "You do not own this task." });
        }

        return res.json({
          id: result.rows[0].id,
          title: result.rows[0].title,
          course: result.rows[0].course,
          completed: Boolean(result.rows[0].completed),
        });
      } catch (error) {
        next(error);
      }
    }
);

tasksRouter.delete(
    "/:id",
    // DONE (PART 3): Replace part3NotImplemented with authentication
    // and instructor-only authorization middleware.
    authenticateToken,
    requireRole("instructor"),
    async (req, res, next) => {
      try {
        const result = await db.run(
            "DELETE FROM tasks WHERE id = ?",
            [req.params.id]
        );

        if (result.changes === 0) {
          return res.status(404).json({ error: "Not Found" });
        }

        return res.status(204).end();
      } catch (error) {
        return next(error);
      }
    }
);
