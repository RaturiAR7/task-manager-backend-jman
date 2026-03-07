import {
  addProjectMember,
  getProjectMembers,
  removeProjectMember,
} from "../controllers/projectMember.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const express = require("express");
const router = express.Router();

router.post(
  "/:projectId/members",
  authMiddleware,
  authorize(["ADMIN", "MANAGER"]),
  addProjectMember,
);

router.delete(
  "/:projectId/members/:userId",
  authMiddleware,
  authorize(["ADMIN", "MANAGER"]),
  removeProjectMember,
);

router.get("/:projectId/members", authMiddleware, getProjectMembers);

module.exports = router;
