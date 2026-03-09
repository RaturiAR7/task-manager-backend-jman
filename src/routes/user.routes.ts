import { getAllUsers, login, register, getMe, getBasicUsers } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const express = require("express");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// ADMIN-only: returns full user objects including sensitive fields
router.get("/getAllUsers", authMiddleware, authorize(["ADMIN"]), getAllUsers);
// Authenticated (any role): returns current user's profile from JWT
router.get("/me", authMiddleware, getMe);
// Authenticated (any role): returns all users with safe fields only (id, name, email, role)
router.get("/users", authMiddleware, getBasicUsers);
module.exports = router;
