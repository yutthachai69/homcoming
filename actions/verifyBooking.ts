'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { BookingStatus, TableStatus } from "@/lib/constants"

export async function verifyBooking(bookingId: string, action: 'APPROVE' | 'REJECT') {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { table: true }
        })

        if (!booking) return { error: "Booking not found" }

        if (action === 'APPROVE') {
            await prisma.$transaction([
                prisma.booking.update({
                    where: { id: bookingId },
                    data: {
                        status: BookingStatus.PAID,
                        verifiedAt: new Date()
                    }
                }),
                prisma.table.update({
                    where: { id: booking.tableId },
                    data: { status: TableStatus.BOOKED }
                })
            ])
        } else {
            // Reject
            await prisma.$transaction([
                prisma.booking.update({
                    where: { id: bookingId },
                    data: {
                        status: BookingStatus.REJECTED,
                        verifiedAt: new Date()
                    }
                }),
                prisma.table.update({
                    where: { id: booking.tableId },
                    data: { status: TableStatus.AVAILABLE } // Release table
                })
            ])
        }

        revalidatePath('/admin')
        revalidatePath('/')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Failed to update booking" }
    }
}
