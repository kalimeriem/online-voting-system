import { Router } from "express";
import { getProfile, getDashboard } from "./user.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/profile", protect, getProfile);
router.get("/dashboard", protect, getDashboard);

export default router;

