import { PrismaClient } from '@prisma/client'
import { matcher } from './matcher';
import { createClient } from 'redis';
import { env } from "./express/common/utils/envConfig";
import transactions from './transactions.json';
import pino from 'pino';

const GBP = {
  currency: 'GBP',
  digits: 2,
}

const prisma = new PrismaClient()
const redis = createClient({url: env.REDIS_URL});
const logger = pino({ name: "ingress start" });

// GBP only
// TODO: add support for other currency
function checkCurrency(transactionAmount: IcedTea.TransactionAmount) {
  const { amount, currency } = transactionAmount;
  if (currency !== 'GBP') {
    throw new Error(`Currency ${currency} is not supported`);
  }
  return {
    amountInMinorUnit: (Number(amount) * Math.pow(10, GBP.digits)),
    currency
  };
}

function parseTransaction({
  userId,
  transactionId,
  valueDate,
  transactionAmount,
  remittanceInformationUnstructured
}: IcedTea.IncomingTransaction): IcedTea.Transaction {

  const { amountInMinorUnit, currency } = checkCurrency(transactionAmount);

  return {
    userId,
    transactionId,
    valueDate: new Date(valueDate),
    amountInMinorUnit,
    currency,
    remittanceInformationUnstructured,
  };
}

async function ingress() {
  await redis.connect();

  const promises = transactions.map(async (line) => {
    try {
      const transaction = parseTransaction(line);
      const { userId, transactionId, valueDate, amountInMinorUnit, currency, remittanceInformationUnstructured } = transaction;
     
      // Create the user if it doesn't exist, unnecessary if we have a separate user creation step
      await prisma.user.createMany({
        data: [{ userId }],
        skipDuplicates: true
      });

      // Upsert the transaction
      await prisma.transaction.upsert({
        where: { transactionId },
        create: {
          transactionId,
          valueDate: new Date(valueDate),
          amountInMinorUnit,
          currency,
          remittanceInformationUnstructured,
          user: { connect: { userId } }
        },
        update: {}
      });

      // Match the transaction
      await matcher(transaction, prisma, redis, logger);
    } catch (e) {
      console.error(e);
    }
  });

  await Promise.allSettled(promises);
}

ingress()
.then(async () => {
  await prisma.$disconnect()
  redis.disconnect();
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  redis.disconnect();
  process.exit(1)
})