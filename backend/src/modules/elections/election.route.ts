import { Router } from "express";
import * as electionController from "./election.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();


router.post("/", protect, electionController.createElection);
router.get("/", protect, electionController.getUserElections);
router.get("/:id/participants", protect, electionController.getParticipants);

export default router;