import { Router } from "express";
import * as voteController from "./vote.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", protect, voteController.castVote);
router.get("/:electionId/results", protect, voteController.getResults);
router.get("/:electionId/user-vote", protect, voteController.getUserVote);

export default router;
