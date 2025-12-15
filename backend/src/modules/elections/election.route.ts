import { Router } from "express";
import * as electionController from "./election.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();


router.post("/", protect, electionController.createElection);
router.get("/all", protect, electionController.getAllElections);
router.get("/", protect, electionController.getUserElections);
router.get("/:id/participants", protect, electionController.getParticipants);
router.post("/:id/add-voters", protect, electionController.addVotersToElection);
router.post("/:id/add-candidate", protect, electionController.addCandidateToElection);

export default router;