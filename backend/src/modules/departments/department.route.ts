import { Router } from "express";
import * as departmentController from "./department.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, departmentController.createDepartment);
router.get("/", protect, departmentController.getDepartments);

export default router;
