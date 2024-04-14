/*
  Warnings:

  - Added the required column `price` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `swordAndBoard` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "price" VARCHAR(15) NOT NULL,
ADD COLUMN     "swordAndBoard" VARCHAR(50) NOT NULL;
