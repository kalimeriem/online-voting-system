/*
  Warnings:

  - A unique constraint covering the columns `[verificationToken]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "verificationToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_verificationToken_key" ON "Admin"("verificationToken");
