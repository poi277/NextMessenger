-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "userObjectId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "amount" INTEGER DEFAULT 1,
    "totalPrice" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
