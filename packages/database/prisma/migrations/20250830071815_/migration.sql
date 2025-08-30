/*
  Warnings:

  - You are about to drop the column `engagement` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "engagement";

-- CreateTable
CREATE TABLE "ProjectEngagement" (
    "id" TEXT NOT NULL,
    "shares" INTEGER NOT NULL,
    "bookmarks" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL,

    CONSTRAINT "ProjectEngagement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_id_fkey" FOREIGN KEY ("id") REFERENCES "ProjectEngagement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
