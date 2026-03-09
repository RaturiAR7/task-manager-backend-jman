import { createTask, deleteTask, getAllTasks, getMyTasks, updateTask } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const express = require("express");
const router = express.Router();

router.post("/:projectId/tasks", authMiddleware,authorize(["ADMIN", "MANAGER"]),createTask);
router.get("/:projectId/tasks", authMiddleware,authorize(["ADMIN", "MANAGER"]), getAllTasks);
router.get("/tasks", authMiddleware,authorize(["EMPLOYEE"]), getMyTasks);
router.patch("/:taskId", authMiddleware, updateTask , authorize(["EMPLOYEE"]) );
router.delete("/:taskId", authMiddleware,authorize(["ADMIN", "MANAGER"]), deleteTask);
module.exports = router;