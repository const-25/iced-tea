import { PrismaClient } from "@prisma/client";
import type { createClient } from "redis";
import { discovery } from "./discovery";
import type { Logger } from "pino";


export async function matcher(transaction: IcedTea.Transaction, prisma: PrismaClient, redis: ReturnType<typeof createClient>, logger: Logger<never, boolean>) {
    const { remittanceInformationUnstructured, transactionId, userId } = transaction;

    // Check if the transaction is a known positive and get venueId
    const venueId = await redis.hGet('match:positive', remittanceInformationUnstructured);

    if (venueId) {
      logger.info({ venueId, remittanceInformationUnstructured }, '🎯 positive hit');
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
      return true;
    }

    // Check if the transaction is a known negative
    const nagative = await redis.bf.exists('match:nagative', remittanceInformationUnstructured);
    if (nagative) {
      logger.info({remittanceInformationUnstructured}, '🪮 negative hit');
      return false; // Abort
    }

    // Transaction not known, send to discovery.ts
    logger.info({remittanceInformationUnstructured}, '🔍 no hit');
    return discovery(transaction, prisma, redis);
}