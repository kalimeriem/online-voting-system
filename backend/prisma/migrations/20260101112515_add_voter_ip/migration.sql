-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "voterIP" TEXT;

-- CreateIndex
CREATE INDEX "Vote_pollId_voterIP_idx" ON "Vote"("pollId", "voterIP");
