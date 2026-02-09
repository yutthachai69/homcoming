'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { BookingStatus } from "@/lib/constants"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getDashboardStats() {
    const session = await getServerSession(authOptions)
    if (!session) return { error: "Unauthorized" }

    const totalBookings = await prisma.booking.count({
        where: { status: BookingStatus.PAID }
    })

    const pendingBookings = await prisma.booking.count({
        where: {
            status: {
                in: [BookingStatus.VERIFYING, BookingStatus.PENDING_PAYMENT]
            }
        }
    })

    // Calculate total revenue (assuming price is fixed at 4000 or dynamic per table)
    // If using table price:
    const paidBookings = await prisma.booking.findMany({
        where: { status: BookingStatus.PAID },
        include: { table: true }
    })

    // Sum up prices (using Number() to convert Decimal if needed, but Prisma returns string/number for Decimal)
    const totalRevenue = paidBookings.reduce((sum, booking) => {
        // Assuming table.price is Decimal, we might need to handle it.
        // For simplicity, let's assume it's directly usable or convert.
        return sum + Number(booking.table.price)
    }, 0)

    const allBookings = await prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        include: { table: true }
    })

    return { totalBookings, pendingBookings, totalRevenue, allBookings }
}

export async function approveBooking(bookingId: string) {
    const session = await getServerSession(authOptions)
    if (!session) return { error: "Unauthorized" }

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { table: true }
        })

        if (!booking) return { error: "Booking not found" }

        await prisma.$transaction([
            prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: BookingStatus.PAID,
                    verifiedAt: new Date(),
                    updatedBy: session.user?.name || session.user?.email
                }
            }),
            prisma.table.update({
                where: { id: booking.tableId },
                data: { status: 'BOOKED' }
            })
        ])

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Failed to approve" }
    }
}

export async function rejectBooking(bookingId: string, reason: string) {
    const session = await getServerSession(authOptions)
    if (!session) return { error: "Unauthorized" }

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { table: true }
        })

        if (!booking) return { error: "Booking not found" }

        await prisma.$transaction([
            prisma.booking.update({
                where: { id: bookingId },
                data: {
                    status: BookingStatus.REJECTED,
                    // adminNotes: reason, // Field not in schema yet
                    updatedBy: session.user?.name || session.user?.email
                }
            }),
            prisma.table.update({
                where: { id: booking.tableId },
                data: { status: 'AVAILABLE' }
            })
        ])

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Failed to reject" }
    }
}

export async function cancelBooking(bookingId: string) {
    const session = await getServerSession(authOptions)
    if (!session) return { error: "Unauthorized" }

    // Logic similar to reject but maybe different status?
    // User requested "Manual Delete / Return Empty". 
    // We can just delete the booking entirely OR set to cancelled.
    // Deleting is cleaner for "fake" data, but keeping history is better.
    // Let's delete for now as per user request "Manual Delete", or maybe specific "CANCELLED" status if we added it.
    // But since schema doesn't have CANCELLED in enum (I only saw PENDING, VERIFYING, PAID, REJECTED), 
    // I will DELETE the booking record to free up the table completely and remove clutter.
    // wait, schema had `Booking` model. If I delete, I lose history.
    // User asked "Management Tools -> การคืนโต๊ะว่าง (Manual Delete)".
    // I'll delete it.

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
        })

        if (!booking) return { error: "Booking not found" }

        await prisma.$transaction([
            prisma.booking.delete({
                where: { id: bookingId }
            }),
            prisma.table.update({
                where: { id: booking.tableId },
                data: { status: 'AVAILABLE' }
            })
        ])

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Failed to delete" }
    }
}

export async function updateBookingDetails(bookingId: string, data: { name?: string, batch?: string, phone?: string }) {
    const session = await getServerSession(authOptions)
    if (!session) return { error: "Unauthorized" }

    try {
        await prisma.booking.update({
            where: { id: bookingId },
            data: {
                customerName: data.name,
                batch: data.batch,
                phone: data.phone,
                updatedBy: session.user?.name || session.user?.email
            }
        })

        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { error: "Failed to update" }
    }
}
