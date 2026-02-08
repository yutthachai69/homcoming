import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        console.log('Start seeding...')

        // Create 80 tables
        for (let i = 1; i <= 80; i++) {
            const tableNumber = i.toString()
            // Check if table exists
            const existingTable = await prisma.table.findUnique({
                where: { number: tableNumber }
            })

            if (!existingTable) {
                await prisma.table.create({
                    data: {
                        number: tableNumber,
                        price: 4000,
                        status: 'AVAILABLE',
                    },
                })
                console.log(`Created table: ${tableNumber}`)
            }
        }

        return NextResponse.json({ message: 'Seeding finished', success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Seeding failed', details: String(error) }, { status: 500 })
    }
}
