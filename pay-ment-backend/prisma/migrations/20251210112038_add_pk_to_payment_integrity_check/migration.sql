/*
  Warnings:

  - You are about to drop the column `amount` on the `CartItem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PaymentIntegrityCheck_orderId_key";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "amount",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "PaymentIntegrityCheck" ADD CONSTRAINT "PaymentIntegrityCheck_pkey" PRIMARY KEY ("orderId");
