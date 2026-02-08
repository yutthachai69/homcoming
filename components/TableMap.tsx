'use client'

import { useState } from 'react'
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

    return (
        <div className="w-full">
            <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                            filter === 'ALL'
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        ทั้งหมด
                    </button>
                    <button
                        onClick={() => setFilter('AVAILABLE')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                            filter === 'AVAILABLE'
                                ? "bg-green-600 text-white shadow-lg shadow-green-500/30"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        ว่าง
                    </button>
                    <button
                        onClick={() => setFilter('BOOKED')}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200",
                            filter === 'BOOKED'
                                ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                    >
                        จองแล้ว
                    </button>
                </div>
            </div>

            <div className="w-full overflow-x-auto p-2 md:p-8 scrollbar-hide">
                <div className="min-w-[600px] mx-auto">
                    <div className="mb-8 md:mb-12 text-center perspective-1000">
                        <div className="relative w-full max-w-2xl mx-auto mb-6 md:mb-8">
                            <div className="relative px-8 md:px-12 py-3 md:py-4 bg-gradient-to-b from-purple-300 via-purple-200 to-purple-100 dark:from-purple-700 dark:via-purple-800 dark:to-purple-900 rounded-t-[60px] md:rounded-t-[80px] text-center shadow-[0_-10px_40px_rgba(147,51,234,0.35)] dark:shadow-[0_-10px_40px_rgba(147,51,234,0.5)] border-t-[3px] border-x-[3px] border-purple-400/70 dark:border-purple-600/70">
                                <span className="text-sm md:text-base font-bold text-purple-950 dark:text-white tracking-wide drop-shadow-md">
                                    เวที (STAGE)
                                </span>
                            </div>

                            <div className="h-2 md:h-3 bg-gradient-to-b from-purple-400/70 via-purple-300/40 to-transparent dark:from-purple-600/70 dark:via-purple-700/40 rounded-b-xl"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4 max-w-5xl mx-auto p-2 md:p-4 place-items-center">
                        {filteredTables.map((table) => {
                            // Basic statuses
                            const isAvailable = table.status === 'AVAILABLE'
                            const isPending = table.status === 'LOCKED' || table.status === 'VERIFYING'
                            const isBooked = table.status === 'BOOKED'

                            // Revert to Classic Clean Style (Round circles)
                            // Using the new theme colors but keeping the shape simple
                            let bgClass = "bg-white border-2 border-green-500 text-green-700 hover:bg-green-50 hover:scale-110 shadow-sm"

                            if (isPending) {
                                bgClass = "bg-amber-100 border-2 border-amber-500 text-amber-700 cursor-not-allowed"
                            }

                            if (isBooked) {
                                bgClass = "bg-red-100 border-2 border-red-300 text-red-500 cursor-not-allowed"
                            }

                            return (
                                <button
                                    key={table.id}
                                    onClick={() => handleTableClick(table)}
                                    disabled={!isAvailable}
                                    className={cn(
                                        "relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full text-xs md:text-sm font-bold transition-all duration-200",
                                        bgClass
                                    )}
                                >
                                    {table.number}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Floating Legend - Responsive (Hidden when filters are active? Or keep it? Keeping it for now as a key) */}
                <div className="sticky bottom-2 md:bottom-4 left-0 right-0 flex justify-center pointer-events-none mt-6 md:mt-8 px-2 md:px-4 z-10">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/20 px-3 py-2 md:px-6 md:py-3 rounded-full shadow-xl flex flex-wrap justify-center gap-3 md:gap-6 text-[10px] md:text-sm pointer-events-auto w-auto max-w-full">
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <span className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-green-500"></span>
                            <span className="text-slate-600 dark:text-slate-300 whitespace-nowrap">ว่าง</span>
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <span className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-amber-500"></span>
                            <span className="text-slate-600 dark:text-slate-300 whitespace-nowrap">รอตรวจสอบ</span>
                        </div>
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <span className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-red-500"></span>
                            <span className="text-slate-600 dark:text-slate-300 whitespace-nowrap">ไม่ว่าง</span>
                        </div>
                    </div>
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
