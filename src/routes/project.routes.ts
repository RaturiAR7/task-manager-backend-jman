import {
  addProjectMember,
  createProject,
  getMyProjects,
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

router.post(
  "/:projectId/members",
  authMiddleware,
  authorize(["ADMIN", "MANAGER"]),
  addProjectMember,
);

module.exports = router;
