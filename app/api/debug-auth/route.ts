import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        return NextResponse.json({
            status: "check",
            session,
            hasSession: !!session,
            env: {
                NEXTAUTH_URL: process.env.NEXTAUTH_URL,
                HAS_SECRET: !!process.env.NEXTAUTH_SECRET,
                NODE_ENV: process.env.NODE_ENV,
            }
        })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}
