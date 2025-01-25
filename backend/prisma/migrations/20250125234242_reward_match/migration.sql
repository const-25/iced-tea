-- CreateTable
CREATE TABLE "RewardMatch" (
    "id" SERIAL NOT NULL,
    "transactionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "venueId" INTEGER NOT NULL,

    CONSTRAINT "RewardMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "venueId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("venueId")
);

-- CreateIndex
CREATE UNIQUE INDEX "RewardMatch_transactionId_key" ON "RewardMatch"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_name_key" ON "Venue"("name");

-- AddForeignKey
ALTER TABLE "RewardMatch" ADD CONSTRAINT "RewardMatch_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("transactionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardMatch" ADD CONSTRAINT "RewardMatch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardMatch" ADD CONSTRAINT "RewardMatch_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("venueId") ON DELETE RESTRICT ON UPDATE CASCADE;
