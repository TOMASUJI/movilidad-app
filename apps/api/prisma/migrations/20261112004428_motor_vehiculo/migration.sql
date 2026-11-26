/*
  Warnings:

  - Added the required column `motor` to the `vehiculos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vehiculos" ADD COLUMN     "motor" VARCHAR(30) NOT NULL;
