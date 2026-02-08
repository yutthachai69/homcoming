'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, Clock, Activity } from "lucide-react"

interface StatsProps {
    stats: {
        totalBookings: number
        pendingBookings: number
        totalRevenue: number
    }
}

export function StatsCards({ stats }: StatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        รายได้รวม (Total Revenue)
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">฿{stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        จาก {stats.totalBookings} การจองที่ชำระเงินแล้ว
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        จองแล้ว (Booked)
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalBookings}</div>
                    <p className="text-xs text-muted-foreground">
                        โต๊ะ
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        รอตรวจสอบ (Pending)
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingBookings}</div>
                    <p className="text-xs text-muted-foreground">
                        รายการที่ต้องดำเนินการ
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
