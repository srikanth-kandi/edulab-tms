import { Router } from "express";
import { updateOrg } from "../controller/orgController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.put("/", authMiddleware, updateOrg);

export default router;
