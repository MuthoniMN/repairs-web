"use client"

import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import EmptyState from "@/src/components/EmptyState";
import Header from "@/src/components/Header";
import CreateSupplier from "@/src/components/suppliers/CreateSupplier";
import { ISupplier } from "@/src/types";
import { Building2, FileSpreadsheet, Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const [open, setOpen] = useState(false);
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);

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

            {
                suppliers.length > 0 ? (<></>) : (<EmptyState
                    title="No Suppliers found"
                    description="You haven't added any suppliers yet"
                    icon={(<Building2 size={64} color="#1E96FC" />)}
                    actions={
                        <Button
                            icon={(<Plus size={18} color="#fff" />)}
                            text="Add New Supplier"
                            event={() => setOpen(true)}
                        />}
                />)
            }
            <CreateSupplier open={open} setOpen={setOpen} />
        </main>
    )
}