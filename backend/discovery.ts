import { PrismaClient } from "@prisma/client";
import type { createClient } from "redis";
import { VENUES_DEFINITIONS } from "./constants";

export async function discovery(transaction: IcedTea.Transaction, prisma: PrismaClient, redis: ReturnType<typeof createClient>) {
  const { remittanceInformationUnstructured, transactionId, userId } = transaction;
  
  const match = VENUES_DEFINITIONS.find(({names}) => {
    const re = new RegExp( names.join( "|" ), "i");
    return re.test(remittanceInformationUnstructured);
  });
  
  if (match) {
    const { venueId } = match;
    redis.hSet('match:positive', remittanceInformationUnstructured, venueId);
    await prisma.rewardMatch.upsert({
      where: { transactionId },
      create: {
        transaction: { connect: { transactionId } },
        user: { connect: { userId } },
        venue: { connect: { venueId: Number(venueId) } }
      },
      update: {}
    });
    
  } else {
    redis.bf.add('match:nagative', remittanceInformationUnstructured);
  }
}