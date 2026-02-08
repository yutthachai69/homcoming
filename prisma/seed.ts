import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create 80 tables
  for (let i = 1; i <= 80; i++) {
    const tableNumber = i.toString()
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

  // Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN',
    },
  })
  console.log(`Created admin user with id: ${admin.id}`)

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
