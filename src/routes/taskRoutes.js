import { Router } from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  getTask,
} from "../controller/taskController.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, roleMiddleware(["admin", "user"]), createTask);
router.put("/", authMiddleware, roleMiddleware(["admin", "user"]), updateTask);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "user"]),
  deleteTask
);
router.get("/", authMiddleware, roleMiddleware(["admin", "user"]), getTasks);
router.get("/:id", authMiddleware, roleMiddleware(["admin", "user"]), getTask);

export default router;
