'use client'

import { useState } from 'react'
import { StatsCards } from "@/components/admin/StatsCards"
import { BookingTable } from "@/components/admin/BookingTable"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

interface AdminViewProps {
    initialStats: any
    initialBookings: any[]
}

export function AdminView({ initialStats, initialBookings }: AdminViewProps) {
    // In a real app, we might use SWR or React Query here to refresh data
    // For now, we rely on Server Actions revalidating path, so router.refresh() might be needed in actions

    return (
        <div className="space-y-8">
            <StatsCards stats={initialStats} />
            <BookingTable bookings={initialBookings} />
        </div>
    )
}
