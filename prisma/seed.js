const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Create 80 tables
    for (let i = 1; i <= 80; i++) {
        const tableNumber = i.toString()
        // Upsert works if we treat status as string for JS client (Prisma translates it)
        // For Enums in JS/TS, we can use strings matching the enum names.
        const table = await prisma.table.upsert({
            where: { number: tableNumber },
            update: {},
            create: {
                number: tableNumber,
                price: 4000,
                status: 'AVAILABLE',
            },
        })
        console.log(`Created table with id: ${table.id}`)
    }

    console.log('Seeding finished.')
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
