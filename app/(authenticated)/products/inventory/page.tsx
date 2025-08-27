"use client"

import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import Header from "@/src/components/Header";
import RestockProduct from "@/src/components/products/RestockProduct";
import StockTable from "@/src/components/products/StockTable";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const [open, setOpen] = useState(false);
    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6 flex flex-col gap-4`}>
            <Header
                title="Inventory"
                description="Track your products' inventory and stocks"
                action={<Button
                    icon={(<Plus size={18} color="#fff" />)}
                    text="Restock Product"
                    event={() => setOpen(true)}
                />}
            />
            <RestockProduct open={open} setOpen={setOpen} />

            <StockTable />
        </main>
    )
}