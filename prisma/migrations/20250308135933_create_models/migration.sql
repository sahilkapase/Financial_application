/*
  Warnings:

  - A unique constraint covering the columns `[github]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "github" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_github_key" ON "users"("github");
