import {
  createProject,
  deleteProject,
  getMyProjects,
  updateProject,
} from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const express = require("express");
const router = express.Router();

router.get("/", authMiddleware, getMyProjects);
router.post(
  "/",
  authMiddleware,
  authorize(["ADMIN", "MANAGER"]),
  createProject,
);
router.patch("/:projectId", authMiddleware, updateProject);
router.delete("/:projectId", authMiddleware, deleteProject);

module.exports = router;
