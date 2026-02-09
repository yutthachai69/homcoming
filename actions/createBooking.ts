'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { BookingStatus, TableStatus } from "@/lib/constants"
import { z } from "zod"
import { rateLimit } from "@/lib/rate-limit"
import { headers } from "next/headers"
import { supabase } from "@/lib/supabase"

// Zod Schema for Validation
const bookingSchema = z.object({
    tableId: z.number().int().positive(),
    name: z.string().min(2, "ชื่อต้องยาวกว่า 2 ตัวอักษร").max(100),
    batch: z.string().min(1, "กรุณาระบุรุ่น"),
    phone: z.string().regex(/^\d{9,10}$/, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
    slip: z.custom<File>((file) => file instanceof File, "กรุณาแนบสลิป").optional().nullable()
})

export async function createBooking(formData: FormData) {
    // 0. Rate Limiting
    const ip = (await headers()).get("x-forwarded-for") || "unknown"
    if (!rateLimit(ip, 5, 60000)) { // 5 requests per minute
        return { error: "ทำรายการเร็วเกินไป กรุณารอสักครู่ (Rate Limit Exceeded)" }
    }

    // 1. Validate Input with Zod
    const rawData = {
        tableId: parseInt(formData.get("tableId") as string),
        name: formData.get("name"),
        batch: formData.get("batch"),
        phone: formData.get("phone"),
        slip: formData.get("slip")
    }

    const validation = bookingSchema.safeParse(rawData)

    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    const { tableId, name, batch, phone, slip } = validation.data
    const file = slip as File | null

    // 2. ตรวจสอบว่าโต๊ะว่างไหม
    const table = await prisma.table.findUnique({ where: { id: tableId } })
    if (!table || table.status !== TableStatus.AVAILABLE) {
        return { error: "โต๊ะนี้ถูกจองไปแล้วครับ หรือไม่ว่าง" }
    }

    // 3. Upload Slip (Supabase Storage)
    let slipUrl = null
    if (file && file.size > 0) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
            return { error: "ไฟล์สลิปต้องเป็นรูปภาพเท่านั้น" }
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            return { error: "ไฟล์สลิปต้องมีขนาดไม่เกิน 5MB" }
        }

        const buffer = await file.arrayBuffer()
        const filename = `${Date.now()}_${file.name.replaceAll(" ", "_")}`

        try {
            const { data, error } = await supabase
                .storage
                .from('slips')
                .upload(filename, buffer, {
                    contentType: file.type,
                    upsert: false
                })

            if (error) {
                console.error("Supabase Upload Error:", error)
                throw error
            }

            // Get Public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from('slips')
                .getPublicUrl(filename)

            slipUrl = publicUrl

        } catch (e) {
            console.error("Upload failed", e)
            return { error: "อัปโหลดสลิปไม่สำเร็จ กรุณาลองใหม่" }
        }
    }

    // 4. บันทึกข้อมูล
    try {
        await prisma.booking.create({
            data: {
                customerName: name,
                batch: batch,
                phone: phone,
                tableId: tableId,
                slipUrl: slipUrl,
                status: slipUrl ? BookingStatus.VERIFYING : BookingStatus.PENDING_PAYMENT
            }
        })

        // 5. อัปเดตสถานะโต๊ะ
        await prisma.table.update({
            where: { id: tableId },
            data: { status: TableStatus.LOCKED }
        })

        revalidatePath('/')
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: "Failed to create booking" }
    }
}
