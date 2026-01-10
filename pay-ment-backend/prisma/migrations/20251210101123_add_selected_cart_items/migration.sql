/*
  Warnings:

  - The primary key for the `PaymentIntegrityCheck` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[orderId]` on the table `PaymentIntegrityCheck` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PaymentIntegrityCheck" DROP CONSTRAINT "PaymentIntegrityCheck_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "selectedCartItemIds" INTEGER[],
ALTER COLUMN "amountCurrency" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntegrityCheck_orderId_key" ON "PaymentIntegrityCheck"("orderId");
