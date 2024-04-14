/*
  Warnings:

  - Added the required column `swordAndBoard` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "swordAndBoardLink" VARCHAR(100),
DROP COLUMN "swordAndBoard",
ADD COLUMN     "swordAndBoard" BOOLEAN NOT NULL;
