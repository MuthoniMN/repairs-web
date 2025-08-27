"use client"

import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import Header from "@/src/components/Header";
import CreateSupplier from "@/src/components/suppliers/CreateSupplier";
import SupplierTable from "@/src/components/suppliers/SupplierTable";
import { FileSpreadsheet, Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const [open, setOpen] = useState(false);

    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6`}>
            <Header
                title="Suppliers"
                description="Track your products' suppliers"
                action={
                    <div className="flex gap-6">
                        <Button
                            icon={(<FileSpreadsheet size={18} color="#1E96FC" />)}
                            text="Import from Excel"
                            type="secondary"
                        />
                        <Button
                            icon={(<Plus size={18} color="#fff" />)}
                            text="Add Supplier"
                            event={() => setOpen(true)}
                        />
                    </div>}
            />

            <SupplierTable />
            <CreateSupplier open={open} setOpen={setOpen} />
        </main>
    )
}