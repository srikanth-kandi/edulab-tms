import { Router } from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUser,
} from "../controller/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", authMiddleware, createUser);
router.put("/", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUser);

export default router;
