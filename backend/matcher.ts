import { PrismaClient } from "@prisma/client";
import type { createClient } from "redis";
import { discovery } from "./discovery";


export async function matcher(transaction: IcedTea.Transaction, prisma: PrismaClient, redis: ReturnType<typeof createClient>) {
    const { remittanceInformationUnstructured, transactionId, userId } = transaction;

    // Check if the transaction is a known positive and get venueId
    const venueId = await redis.hGet('match:positive', remittanceInformationUnstructured);

    if (venueId) {
      // Upsert the match
      await prisma.rewardMatch.upsert({
        where: { transactionId },
        create: {
          transaction: { connect: { transactionId } },
          user: { connect: { userId } },
          venue: { connect: { venueId: Number(venueId) } }
        },
        update: {}
      });
    }

    // Check if the transaction is a known negative
    const nagative = await redis.bf.exists('match:nagative', remittanceInformationUnstructured);
    if (nagative) return false; // Abort

    // Transaction not known, send to discovery.ts
    discovery(transaction, prisma, redis);
}