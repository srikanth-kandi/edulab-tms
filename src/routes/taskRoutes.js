import { Router } from "express";
import { createTask } from "../controller/taskController.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, roleMiddleware(["admin", "user"]), createTask);
// Add more routes for read, update, delete tasks

export default router;
