import { PrismaClient } from '@prisma/client'
import readline from 'readline';
import fs from 'fs';

const GBP = {
  currency: 'GBP',
  digits: 2,
}

const prisma = new PrismaClient()

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

function parseTransaction(line: string): IcedTea.Transaction {
  const {
    userId,
    transactionId,
    valueDate,
    transactionAmount,
    remittanceInformationUnstructured
  }: IcedTea.IncomingTransaction = JSON.parse(line);

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

  // Read the file line by line
  const rl = readline.createInterface({
    input: fs.createReadStream('../transactions.jsonl'),
    crlfDelay: Infinity
  });
  
  rl.on('line', async (line) => {
    try {
      const transaction = parseTransaction(line);
      const { userId, transactionId, valueDate, amountInMinorUnit, currency, remittanceInformationUnstructured } = transaction;
     
      await prisma.user.createMany({
        data: [{ userId }],
        skipDuplicates: true
      });

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

    } catch (e) {
      console.error(e);
    }
  });
}

ingress()
.then(async () => {
  await prisma.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})