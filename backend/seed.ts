import { PrismaClient } from '@prisma/client'
import { createClient } from 'redis';
import { VENUES_SEED } from './constants'
import { env } from "./express/common/utils/envConfig";

const prisma = new PrismaClient()
const redis = createClient({url: env.REDIS_URL});

async function seed() {
  await redis.connect();
  try {
    await redis.bf.info('match:nagative');
  } catch (e) {
    console.log('Reserving bloom filter');
    await redis.bf.reserve('match:nagative', 0.005, 10000);
  }

  console.log('Seeding database');
  await prisma.venue.createMany({
    data: VENUES_SEED,
    skipDuplicates: true
  })
}

seed()
.then(async () => {
  await prisma.$disconnect()
  await redis.disconnect();
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  await redis.disconnect();
  process.exit(1)
})