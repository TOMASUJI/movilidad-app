/*
  Warnings:

  - You are about to drop the column `nombre` on the `vehiculos` table. All the data in the column will be lost.
  - Added the required column `marca` to the `vehiculos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelo` to the `vehiculos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vehiculos" DROP COLUMN "nombre",
ADD COLUMN     "marca" VARCHAR(30) NOT NULL,
ADD COLUMN     "modelo" VARCHAR(30) NOT NULL;
