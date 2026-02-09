'use client'

import { useState } from 'react'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createBooking } from "@/actions/createBooking"
import { toast } from "sonner"

interface Table {
    id: number
    number: string
    status: string
    price: number
}

interface BookingFormProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    table: Table | null
}

export function BookingForm({ open, onOpenChange, table }: BookingFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ name?: string; batch?: string; phone?: string }>({})

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!table) return

        setLoading(true)
        setErrors({}) // Reset errors

        const formData = new FormData(event.currentTarget)
        const name = formData.get("name") as string
        const batch = formData.get("batch") as string
        const phone = formData.get("phone") as string

        // Validation
        const newErrors: { name?: string; batch?: string; phone?: string } = {}
        if (!name || name.trim() === "") newErrors.name = "กรุณากรอกชื่อ-นามสกุล"
        if (!batch || batch.trim() === "") newErrors.batch = "กรุณากรอกรุ่น"
        if (!phone || phone.trim() === "") newErrors.phone = "กรุณากรอกเบอร์โทร"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setLoading(false)
            return
        }

        formData.append("tableId", table.id.toString())

        try {
            const result = await createBooking(formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("จองโต๊ะสำเร็จ! กรุณารอแอดมินตรวจสอบ")
                onOpenChange(false)
                router.refresh()
            }
        } catch (error) {
            console.error(error)
            toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่")
        } finally {
            setLoading(false)
        }
    }

    if (!table) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>จองโต๊ะ {table.number}</DialogTitle>
                    <DialogDescription>
                        กรุณากรอกข้อมูลและแนบสลิปการโอนเงิน (ราคา {table.price} บาท)
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* QR Code Section - Moved to Top */}
                    <div className="flex flex-col items-center justify-center gap-2 mb-4">
                        <span className="text-sm font-medium">สแกนเพื่อจ่ายเงิน</span>
                        <div className="border-2 border-dashed p-2 rounded-lg bg-gray-50">
                            {/* User requested image replacement */}
                            <img src="/Qr Code.jpg" alt="Payment QR Code" className="w-48 h-auto object-contain rounded-md" />
                        </div>
                        <div className="text-center text-xs text-muted-foreground mt-1">
                            <p className="font-bold">ธนาคารกสิกรไทย</p>
                            <p>012-3-45678-9</p>
                            <p>ชื่อบัญชี: ออมเอง</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            ชื่อ-นามสกุล
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="name"
                                name="name"
                                className={errors.name ? "border-red-500" : ""}
                                onChange={() => setErrors({ ...errors, name: undefined })}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="batch" className="text-right">
                            รุ่น (Batch)
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="batch"
                                name="batch"
                                className={errors.batch ? "border-red-500" : ""}
                                onChange={() => setErrors({ ...errors, batch: undefined })}
                            />
                            {errors.batch && <p className="text-red-500 text-xs mt-1">{errors.batch}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            เบอร์โทร
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="phone"
                                name="phone"
                                className={errors.phone ? "border-red-500" : ""}
                                onChange={() => setErrors({ ...errors, phone: undefined })}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="slip" className="text-right">
                            แนบสลิป
                        </Label>
                        <Input id="slip" name="slip" type="file" accept="image/*" className="col-span-3" />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "กำลังบันทึก..." : "ยืนยันการจอง"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
