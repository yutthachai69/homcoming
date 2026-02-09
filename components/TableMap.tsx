'use client'

import { useState, useEffect } from 'react'
import { cn } from "@/lib/utils"
import { BookingForm } from "./BookingForm"

interface Table {
    id: number
    number: string
    status: string
    price: number
}

interface TableMapProps {
    tables: Table[]
}

export function TableMap({ tables }: TableMapProps) {
    const [selectedTable, setSelectedTable] = useState<Table | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filter, setFilter] = useState<'ALL' | 'AVAILABLE' | 'BOOKED' | 'LOCKED'>('ALL')
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <div className="w-full h-96 flex items-center justify-center text-slate-400">Loading tables...</div>
    }

    const handleTableClick = (table: Table) => {
        if (table.status === 'AVAILABLE') {
            setSelectedTable(table)
            setIsModalOpen(true)
        } else {
            // Optional: show info even if booked?
        }
    }

    const filteredTables = tables.filter(table => {
        if (filter === 'ALL') return true
        if (filter === 'AVAILABLE') return table.status === 'AVAILABLE'
        if (filter === 'BOOKED') return table.status === 'BOOKED' || table.status === 'LOCKED' || table.status === 'VERIFYING'
        return true
    })

    const totalTables = tables.length
    const availableTables = tables.filter(t => t.status === 'AVAILABLE').length
    const bookedTables = totalTables - availableTables

    // Mobile-optimized grid: 10 columns always
    return (
        <div className="w-full max-w-3xl mx-auto px-2 md:px-0">
            {/* Stats Summary Dashboard */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
                <div className="bg-slate-800 text-white rounded-2xl p-3 text-center shadow-lg">
                    <div className="text-[10px] md:text-sm text-slate-300 mb-1">ทั้งหมด</div>
                    <div className="text-xl md:text-3xl font-bold">{totalTables}</div>
                </div>
                <div className="bg-green-600 text-white rounded-2xl p-3 text-center shadow-lg shadow-green-500/20">
                    <div className="text-[10px] md:text-sm text-green-100 mb-1">ว่าง</div>
                    <div className="text-xl md:text-3xl font-bold">{availableTables}</div>
                </div>
                <div className="bg-red-600 text-white rounded-2xl p-3 text-center shadow-lg shadow-red-500/20">
                    <div className="text-[10px] md:text-sm text-red-100 mb-1">จองแล้ว</div>
                    <div className="text-xl md:text-3xl font-bold">{bookedTables}</div>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-full max-w-sm">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={cn(
                            "flex-1 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200",
                            filter === 'ALL'
                                ? "bg-purple-600 text-white shadow-md"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                        )}
                    >
                        ทั้งหมด
                    </button>
                    <button
                        onClick={() => setFilter('AVAILABLE')}
                        className={cn(
                            "flex-1 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200",
                            filter === 'AVAILABLE'
                                ? "bg-green-600 text-white shadow-md"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                        )}
                    >
                        ว่าง
                    </button>
                    <button
                        onClick={() => setFilter('BOOKED')}
                        className={cn(
                            "flex-1 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all duration-200",
                            filter === 'BOOKED'
                                ? "bg-red-600 text-white shadow-md"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                        )}
                    >
                        จองแล้ว
                    </button>
                </div>
            </div>

            {/* Stage & Grid Area */}
            <div className="bg-white/50 dark:bg-slate-900/50 rounded-3xl p-4 md:p-8 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50">
                <div className="mb-6 md:mb-10 text-center perspective-1000">
                    <div className="relative w-full max-w-[200px] md:max-w-md mx-auto">
                        <div className="px-4 py-2 bg-gradient-to-b from-purple-200 to-purple-50 dark:from-purple-900 dark:to-purple-950 rounded-t-[30px] md:rounded-t-[50px] border-t-2 border-x-2 border-purple-300 dark:border-purple-700 shadow-lg">
                            <span className="text-xs md:text-base font-bold text-purple-900 dark:text-purple-100">
                                เวที (STAGE)
                            </span>
                        </div>
                        <div className="h-4 bg-gradient-to-b from-purple-200/50 to-transparent"></div>
                    </div>
                </div>

                <div className="grid grid-cols-10 gap-1.5 md:gap-4 place-items-center">
                    {filteredTables.map((table) => {
                        const isAvailable = table.status === 'AVAILABLE'
                        const isPending = table.status === 'LOCKED' || table.status === 'VERIFYING'
                        const isBooked = table.status === 'BOOKED'

                        let bgClass = "bg-white border md:border-2 border-green-500 text-green-700 shadow-sm hover:scale-105 active:scale-95"

                        if (isPending) {
                            bgClass = "bg-amber-100 border md:border-2 border-amber-500 text-amber-700 opacity-60"
                        }

                        if (isBooked) {
                            bgClass = "bg-slate-100 border md:border-2 border-slate-300 text-slate-400 opacity-50"
                        }

                        // Compact sizing logic for mobile
                        return (
                            <button
                                key={table.id}
                                onClick={() => handleTableClick(table)}
                                disabled={!isAvailable}
                                className={cn(
                                    "relative flex items-center justify-center rounded-full transition-all duration-200",
                                    "w-7 h-7 text-[10px]", // Mobile size
                                    "md:w-12 md:h-12 md:text-sm", // Desktop size
                                    "font-bold",
                                    bgClass
                                )}
                            >
                                {table.number}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex justify-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-white border border-green-500"></div>
                    <span>ว่าง</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-100 border border-amber-500"></div>
                    <span>รอตรวจสอบ</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-300"></div>
                    <span>ไม่ว่าง</span>
                </div>
            </div>

            <BookingForm
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                table={selectedTable}
            />
        </div>
    )
}
