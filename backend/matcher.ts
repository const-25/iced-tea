import { PrismaClient } from "@prisma/client";
import type { createClient } from "redis";


export async function matcher(transaction: IcedTea.Transaction, prisma: PrismaClient, redis: ReturnType<typeof createClient>) {
    const { remittanceInformationUnstructured, transactionId, userId } = transaction;

    // Check if the transaction is a known negative
    const nagative = await redis.bf.exists('match:nagative', remittanceInformationUnstructured);
    if (nagative) return false;

    // Check if the transaction is a known positive and get venue
    const venueId = await redis.hGet('match:positive', remittanceInformationUnstructured);

    if (venueId) {
      await prisma.rewardMatch.upsert({
        where: { transactionId },
        create: {
          transaction: { connect: { transactionId } },
          user: { connect: { userId } },
          venue: { connect: { venueId: Number(venueId) } }
        },
        update: {}
      });
      console.log(transaction);
    }

    // Transaction not known, send to discovery.ts
    // console.log(transaction);
}