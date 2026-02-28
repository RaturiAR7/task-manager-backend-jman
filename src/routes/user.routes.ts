import { getAllUsers, login, register } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const express = require("express");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getAllUsers",authMiddleware,authorize(["ADMIN"]), getAllUsers);

module.exports = router;
