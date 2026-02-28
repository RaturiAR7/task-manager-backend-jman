import { createProject } from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const express = require("express");
const router = express.Router();

router.post("/",authMiddleware,authorize(["ADMIN","MANAGER"]),createProject);

module.exports=router;