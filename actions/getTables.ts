'use server'

import prisma from "@/lib/prisma"

export async function getTables() {
    try {
        const tables = await prisma.table.findMany({
            orderBy: {
                number: 'asc', // เรียงตามเลขที่โต๊ะ (String แต่ถ้าเป็นตัวเลขควรระวัง 1, 10, 2)
            },
        })

        // Sort manually if needed for numeric string "1", "2", "10"
        return tables.map(table => ({
            ...table,
            price: table.price.toNumber()
        })).sort((a, b) => parseInt(a.number) - parseInt(b.number))
    } catch (error) {
        console.error("Error fetching tables:", error)
        return []
    }
}
