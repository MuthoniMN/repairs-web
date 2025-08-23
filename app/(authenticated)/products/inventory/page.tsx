"use client"

import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import EmptyState from "@/src/components/EmptyState";
import Header from "@/src/components/Header";
import RestockProduct from "@/src/components/products/RestockProduct";
import { IStock } from "@/src/types";
import { Plus, Warehouse } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const [open, setOpen] = useState(false);
    const [stocks, setStocks] = useState<IStock[]>([]);

    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6`}>
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

            {
                stocks.length > 0 ? (<></>) : (<EmptyState
                    title="No Stocks found"
                    description="You haven't added any stocks yet"
                    icon={(<Warehouse size={64} color="#1E96FC" />)}
                    actions={
                        <Button
                            icon={(<Plus size={18} color="#fff" />)}
                            text="Restock Product"
                            event={() => setOpen(true)}
                        />}
                />)
            }
        </main>
    )
}