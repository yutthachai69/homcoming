'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic';

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            console.log("Attempting login...")
            const result = await signIn('credentials', {
                username,
                password,
                redirect: false,
            })

            console.log("Login result:", result)

            if (result?.error) {
                toast.error("เข้าสู่ระบบไม่สำเร็จ: " + result.error)
            } else if (result?.ok) {
                toast.success("เข้าสู่ระบบสำเร็จ กำลังไปหน้า Admin...")
                router.push('/admin')
                router.refresh()
            }
        } catch (error) {
            console.error("Login error:", error)
            toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>เข้าสู่ระบบจัดการสำหรับเจ้าหน้าที่</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ (Admin)"}
                        </Button>
                        <p className="text-xs text-gray-400 text-center">Version 1.3 (Final Fix)</p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

