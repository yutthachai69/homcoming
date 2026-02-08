import { getDashboardStats } from "@/actions/adminActions"
import { AdminView } from "@/components/admin/AdminView"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const data = await getDashboardStats()

    if ('error' in data) {
        // If unauthorized or error, redirect to login
        // Although middleware should handle this, double safety
        redirect('/management/auth/login')
    }

    return (
        <div className="container mx-auto p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    ระบบจัดการการจองโต๊ะงานคืนสู่เหย้า
                </p>
            </div>

            <AdminView
                initialStats={{
                    totalBookings: data.totalBookings,
                    pendingBookings: data.pendingBookings,
                    totalRevenue: data.totalRevenue
                }}
                initialBookings={data.allBookings}
            />
        </div>
    )
}
