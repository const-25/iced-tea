-- CreateTable
CREATE TABLE "Transaction" (
    "transactionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "valueDate" DATE NOT NULL,
    "amountInMinorUnit" INTEGER NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "remittanceInformationUnstructured" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transactionId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" UUID NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
