/*
  Warnings:

  - You are about to drop the column `price` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentKey` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Made the column `amount` on table `Payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Payment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "price",
DROP COLUMN "productId",
DROP COLUMN "productName",
DROP COLUMN "totalPrice",
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "paymentKey" TEXT NOT NULL,
ALTER COLUMN "amount" SET NOT NULL,
ALTER COLUMN "amount" DROP DEFAULT,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(3);
