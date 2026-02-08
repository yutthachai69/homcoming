import { getTables } from "@/actions/getTables";

export async function HeaderStats() {
    const tables = await getTables();

    const total = tables.length;
    const available = tables.filter(t => t.status === 'AVAILABLE').length;
    const booked = tables.filter(t => t.status === 'BOOKED' || t.status === 'LOCKED' || t.status === 'VERIFYING').length;

    return (
        <div className="hidden md:flex items-center gap-0 border border-white/20 rounded-xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-sm">
            <div className="px-5 py-2 flex flex-col items-center justify-center border-r border-white/10 bg-white/5">
                <span className="text-[10px] text-blue-200 uppercase tracking-wider font-medium">ทั้งหมด</span>
                <span className="text-xl font-bold text-white">{total}</span>
            </div>
            <div className="px-5 py-2 flex flex-col items-center justify-center border-r border-white/10 bg-green-500/20">
                <span className="text-[10px] text-green-300 uppercase tracking-wider font-medium">ว่าง</span>
                <span className="text-xl font-bold text-green-400">{available}</span>
            </div>
            <div className="px-5 py-2 flex flex-col items-center justify-center bg-red-500/20">
                <span className="text-[10px] text-red-300 uppercase tracking-wider font-medium">จองแล้ว</span>
                <span className="text-xl font-bold text-red-400">{booked}</span>
            </div>
        </div>
    );
}
