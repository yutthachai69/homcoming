import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import * as bcrypt from "bcryptjs"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // 1. Hash the password "1234"
        const hashedPassword = await bcrypt.hash("1234", 10)

        // 2. Upsert admin user (Create if not exists, Update if exists)
        const admin = await prisma.admin.upsert({
            where: { username: 'admin' },
            update: {
                password: hashedPassword,
                role: 'ADMIN',
                name: 'System Admin'
            },
            create: {
                username: 'admin',
                password: hashedPassword,
                role: 'ADMIN',
                name: 'System Admin'
            }
        })

        return NextResponse.json({
            success: true,
            message: "Admin password reset successfully to '1234'",
            admin: {
                id: admin.id,
                username: admin.username,
                role: admin.role
            }
        })

    } catch (error: any) {
        console.error("Reset Error:", error)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
