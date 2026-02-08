import { getTables } from "@/actions/getTables";
import { TableMap } from "@/components/TableMap";
import { Toaster } from "sonner";

export const dynamic = 'force-dynamic'

export default async function Home() {
    const tables = await getTables();

    return (
        <main className="min-h-screen p-4 md:p-8 space-y-12">

            {/* Main Booking Section */}
            <section className="max-w-7xl mx-auto">
                <div className="">

                    <TableMap tables={tables as any[]} />
                    {/* Type casting if needed or fix types in getTables */}
                </div>
            </section>

            <Toaster />
        </main>
    );
}
