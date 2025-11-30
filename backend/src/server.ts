import app from "./app";
import dotenv from "dotenv";
import { startElectionStatusScheduler } from "./utils/electionScheduler";

dotenv.config();

const PORT = process.env.PORT || 5000;

startElectionStatusScheduler();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
