import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import * as bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                const admin = await prisma.admin.findUnique({
                    where: { username: credentials.username }
                })

                if (!admin) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, admin.password)

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: admin.id,
                    name: admin.name,
                    email: admin.username, // Using email field for username to keep it simple with default types
                    role: admin.role
                }
            }
        })
    ],
    pages: {
        signIn: '/management/auth/login',
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role
            }
            return session
        }
    }
},
    debug: true
}
