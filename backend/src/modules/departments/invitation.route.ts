import { Router } from "express";
import * as invitationController from "./invitation.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, invitationController.sendInvitation);
router.get("/", protect, invitationController.listUserInvitations);
router.post("/respond", protect, invitationController.respondInvitation);

export default router;
