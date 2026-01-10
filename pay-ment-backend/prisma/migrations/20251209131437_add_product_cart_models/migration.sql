-- CreateTable
CREATE TABLE "PaymentIntegrityCheck" (
    "orderId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PaymentIntegrityCheck_pkey" PRIMARY KEY ("orderId")
);
