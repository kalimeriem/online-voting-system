/*
  Warnings:

  - You are about to drop the column `verificationToken` on the `Admin` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Admin_verificationToken_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "verificationToken",
ADD COLUMN     "codeExpiresAt" TIMESTAMP(3),
ADD COLUMN     "verificationCode" TEXT;
