'use client'

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle, XCircle, Trash2, Edit } from "lucide-react"
import { approveBooking, rejectBooking, cancelBooking, updateBookingDetails } from "@/actions/adminActions"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { BookingStatus } from "@/lib/constants"

interface Booking {
    id: string
    customerName: string
    batch: string
    phone: string
    status: string
    createdAt: Date | string
    slipUrl: string | null
    table: {
        number: string
        price: number | string
    }
}

interface BookingTableProps {
    bookings: Booking[]
}

export function BookingTable({ bookings }: BookingTableProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState<string>('ALL')
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

    // Modal states
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [rejectReason, setRejectReason] = useState('')

    const [showEditModal, setShowEditModal] = useState(false)
    const [editForm, setEditForm] = useState({ name: '', batch: '', phone: '' })

    const [showVerifyModal, setShowVerifyModal] = useState(false) // For viewing slip and approving

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.phone.includes(searchTerm) ||
            booking.table.number.includes(searchTerm)

        const matchesStatus = filterStatus === 'ALL' || booking.status === filterStatus

        return matchesSearch && matchesStatus
    })

    const handleApprove = async (id: string) => {
        const result = await approveBooking(id)
        if (result.success) {
            toast.success("อนุมัติการจองเรียบร้อย")
            setShowVerifyModal(false)
        } else {
            toast.error("เกิดข้อผิดพลาดในการอนุมัติ")
        }
    }

    const handleReject = async () => {
        if (!selectedBooking) return
        const result = await rejectBooking(selectedBooking.id, rejectReason)
        if (result.success) {
            toast.success("ปฏิเสธการจองเรียบร้อย")
            setShowRejectModal(false)
            setShowVerifyModal(false)
        } else {
            toast.error("เกิดข้อผิดพลาด")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("คุณแน่ใจหรือไม่ที่จะลบการจองนี้? โต๊ะจะกลับมาว่างทันที")) return
        const result = await cancelBooking(id)
        if (result.success) {
            toast.success("ลบการจองเรียบร้อย")
        } else {
            toast.error("เกิดข้อผิดพลาดในการลบ")
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedBooking) return

        const result = await updateBookingDetails(selectedBooking.id, editForm)
        if (result.success) {
            toast.success("แก้ไขข้อมูลเรียบร้อย")
            setShowEditModal(false)
        } else {
            toast.error("เกิดข้อผิดพลาดในการแก้ไข")
        }
    }

    const openVerify = (booking: Booking) => {
        setSelectedBooking(booking)
        setShowVerifyModal(true)
    }

    const openEdit = (booking: Booking) => {
        setSelectedBooking(booking)
        setEditForm({
            name: booking.customerName,
            batch: booking.batch,
            phone: booking.phone
        })
        setShowEditModal(true)
    }

    const openReject = () => {
        setRejectReason('')
        setShowRejectModal(true)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case BookingStatus.PAID:
                return <Badge variant="success">ชำระเงินแล้ว</Badge>
            case BookingStatus.VERIFYING:
            case BookingStatus.PENDING_PAYMENT:
                return <Badge variant="warning">รอตรวจสอบ</Badge>
            case BookingStatus.REJECTED:
                return <Badge variant="destructive">ปฏิเสธ</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="ค้นหาชื่อ, เบอร์โทร, หรือเลขโต๊ะ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-[300px]"
                    />
                    <div className="flex gap-2">
                        <Button
                            variant={filterStatus === 'ALL' ? 'default' : 'outline'}
                            onClick={() => setFilterStatus('ALL')}
                            size="sm"
                        >
                            ทั้งหมด
                        </Button>
                        <Button
                            variant={filterStatus === BookingStatus.PENDING_PAYMENT ? 'default' : 'outline'}
                            onClick={() => setFilterStatus(BookingStatus.PENDING_PAYMENT)}
                            size="sm"
                        >
                            รอตรวจสอบ
                        </Button>
                        <Button
                            variant={filterStatus === BookingStatus.PAID ? 'default' : 'outline'}
                            onClick={() => setFilterStatus(BookingStatus.PAID)}
                            size="sm"
                        >
                            สำเร็จ
                        </Button>
                    </div>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>โต๊ะ</TableHead>
                            <TableHead>ชื่อ-นามสกุล</TableHead>
                            <TableHead>รุ่น</TableHead>
                            <TableHead>วันที่จอง</TableHead>
                            <TableHead>สถานะ</TableHead>
                            <TableHead className="text-right">จัดการ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    ไม่พบข้อมูล
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell className="font-medium">{booking.table.number}</TableCell>
                                    <TableCell>{booking.customerName}</TableCell>
                                    <TableCell>{booking.batch}</TableCell>
                                    <TableCell suppressHydrationWarning>{new Date(booking.createdAt).toLocaleString('th-TH')}</TableCell>
                                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        {(booking.status === BookingStatus.VERIFYING || booking.status === BookingStatus.PENDING_PAYMENT) && (
                                            <Button size="sm" onClick={() => openVerify(booking)}>
                                                ตรวจสอบ
                                            </Button>
                                        )}
                                        <Button size="icon" variant="ghost" onClick={() => openEdit(booking)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(booking.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Verify Modal */}
            <Dialog open={showVerifyModal} onOpenChange={setShowVerifyModal}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>ตรวจสอบการโอนเงิน (โต๊ะ {selectedBooking?.table.number})</DialogTitle>
                        <DialogDescription>
                            ยอดชำระ: {selectedBooking?.table.price} บาท
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2">ข้อมูลผู้จอง</h4>
                                <p className="text-sm">ชื่อ: {selectedBooking?.customerName}</p>
                                <p className="text-sm">รุ่น: {selectedBooking?.batch}</p>
                                <p className="text-sm">โทร: {selectedBooking?.phone}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">สลิปการโอน</h4>
                                {selectedBooking?.slipUrl ? (
                                    <a href={selectedBooking.slipUrl} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={selectedBooking.slipUrl}
                                            alt="Slip"
                                            className="w-full h-48 object-contain rounded border bg-slate-50"
                                        />
                                    </a>
                                ) : (
                                    <p className="text-red-500 text-sm">ไม่พบรูปสลิป</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="destructive" onClick={openReject}>
                            ปฏิเสธการจอง
                        </Button>
                        <Button onClick={() => selectedBooking && handleApprove(selectedBooking.id)} className="bg-green-600 hover:bg-green-700">
                            อนุมัติการจอง
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ปฏิเสธการจอง</DialogTitle>
                        <DialogDescription>
                            กรุณาระบุเหตุผลที่ปฏิเสธ (เช่น สลิปไม่ถูกต้อง)
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="reason">เหตุผล</Label>
                        <Input
                            id="reason"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="ระบุเหตุผล..."
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectModal(false)}>ยกเลิก</Button>
                        <Button variant="destructive" onClick={handleReject}>ยืนยันปฏิเสธ</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>แก้ไขข้อมูลผู้จอง</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-name" className="text-right">ชื่อ</Label>
                            <Input
                                id="edit-name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-batch" className="text-right">รุ่น</Label>
                            <Input
                                id="edit-batch"
                                value={editForm.batch}
                                onChange={(e) => setEditForm({ ...editForm, batch: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-phone" className="text-right">เบอร์โทร</Label>
                            <Input
                                id="edit-phone"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit">บันทึกการแก้ไข</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
