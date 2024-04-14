import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.game.create({
        data: {
          title: 'Gloomhaven: Jaws of the Lion',
        },
      })
    const games = await prisma.game.findMany()
    console.log(games)
  }

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })