import { PrismaClient } from '@prisma/client'
import { VENUES_SEED } from './constants'

const prisma = new PrismaClient()

async function seed() {
// const nagative = await redis.bf.exists('match:nagative', remittanceInformationUnstructured);

  await prisma.venue.createMany({
    data: VENUES_SEED
  })
}

seed()
.then(async () => {
  await prisma.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})