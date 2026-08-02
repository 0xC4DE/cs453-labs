import { Router } from "express";
import { authenticateToken, AuthenticatedUser } from "../middleware/authentication";
import { requireProjectOwnerOrAdmin, requireRole } from "../middleware/authorization";
import {
	validateCreateProject,
	validatePatchProject,
	validateProjectId,
} from "../middleware/projectValidation";
import {
	createProject,
	deleteProjectById,
	getProjectByIdForUser,
	listProjects,
	listProjectsForUser,
	updateProjectById,
} from "../services/projectService";

export const projectRoutes = Router();

projectRoutes.get("/", authenticateToken, async (req, res, next) => {
	const user = req.user as AuthenticatedUser;
	const userId = Number(user.sub);

	try {
		const projects = await listProjectsForUser(userId, user.role);
		res.json(projects);
	} catch (error) {
		next(error);
	}
});

projectRoutes.post("/", authenticateToken, validateCreateProject, async (req, res, next) => {
	const name = req.body.name;
	const description = req.body.description;
	const ownerId = Number(req.user?.sub);

	try {
		const project = await createProject({ name, description, ownerId });
		res.status(201).json(project);
	} catch (error) {
		next(error);
	}
});

// This is the singular route that requires admin to be able to operate
projectRoutes.get("/admin/all", authenticateToken, requireRole("admin"), async (_req, res, next) => {
	try {
		const projects = await listProjects();
		res.json(projects);
	} catch (error) {
		next(error);
	}
});

projectRoutes.get("/:id", authenticateToken, validateProjectId, async (req, res, next) => {
	const id = Number(req.params.id);
	const user = req.user as AuthenticatedUser;
	const userId = Number(user.sub);

	try {
		const project = await getProjectByIdForUser(id, userId, user.role);
		if (!project) {
			return res.status(404).json({
				error: "Project not found",
			});
		}

		res.json(project);
	} catch (error) {
		next(error);
	}
});

projectRoutes.patch(
	"/:id",
	authenticateToken,
	validateProjectId,
	validatePatchProject,
	requireProjectOwnerOrAdmin,
	async (req, res, next) => {
		const id = Number(req.params.id);
		const name = req.body.name;
		const description = req.body.description;

		try {
			const project = await updateProjectById(id, { name, description });
			if (!project) {
				return res.status(404).json({
					error: "Project not found",
				});
			}

			res.json(project);
		} catch (error) {
			next(error);
		}
	},
);

projectRoutes.delete(
	"/:id",
	authenticateToken,
	validateProjectId,
	requireProjectOwnerOrAdmin,
	async (req, res, next) => {
		const id = Number(req.params.id);

		try {
			const deleted = await deleteProjectById(id);
			if (!deleted) {
				return res.status(404).json({
					error: "Project not found",
				});
			}

			res.status(204).send();
		} catch (error) {
			next(error);
		}
	},
);

