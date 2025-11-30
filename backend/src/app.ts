import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.route";
import userRoutes from "./modules/users/user.route";
import departmentRoutes from "./modules/departments/department.route"
import invitationRoutes from "./modules/departments/invitation.route";
import electionRoutes from "./modules/elections/election.route";
import voteRoutes from "./modules/votes/vote.route";
import errorHandler from "./middlewares/error.middleware";


const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({ message: "Voting System API is running" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/departments", departmentRoutes);
app.use("/invitations", invitationRoutes);
app.use("/elections", electionRoutes);
app.use("/votes", voteRoutes);

// Centralized error handler (should be last middleware)
app.use(errorHandler);

export default app;
