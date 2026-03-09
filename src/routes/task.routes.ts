import { createTask, deleteTask, getAllTasks, getMyTasks, updateTask } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const express = require("express");
const router = express.Router();

router.post("/:projectId/tasks", authMiddleware, authorize(["ADMIN", "MANAGER"]), createTask);
router.get("/:projectId/tasks", authMiddleware, authorize(["ADMIN", "MANAGER"]), getAllTasks);
router.get("/tasks", authMiddleware, authorize(["EMPLOYEE", "MANAGER", "ADMIN"]), getMyTasks);
// Fixed: authorize must come BEFORE the controller handler, not after
router.patch("/tasks/:taskId", authMiddleware, authorize(["EMPLOYEE", "MANAGER", "ADMIN"]), updateTask);
router.delete("/tasks/:taskId", authMiddleware, authorize(["ADMIN", "MANAGER"]), deleteTask);
module.exports = router;
