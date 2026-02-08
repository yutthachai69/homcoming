import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        // Simple role check logic if needed
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
        pages: {
            signIn: '/management/auth/login',
        }
    }
)

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"]
}
