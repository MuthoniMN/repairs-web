"use client"

import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import Header from "@/src/components/Header";
import { Plus, ReceiptText } from "lucide-react";
import { useState } from "react";
import CreateRecord from "@/src/components/payments/CreateRecord";
import CreateInvoice from "@/src/components/payments/CreateInvoice";
import { IInvoice } from "@/src/types";
import EmptyState from "@/src/components/EmptyState";

export default function Payments() {
    const [open, setOpen] = useState(false);
    const [invoices, setInvoices] = useState<IInvoice[]>([]);

    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6`}>
            <Header
                title="Invoices"
                description="Manage your company invoices"
                action={<Button
                    icon={(<Plus size={18} color="#fff" />)}
                    text="Create an Invoice"
                    event={() => setOpen(true)}
                />}
            />
            {
                invoices.length > 0 ? (<></>) : (<EmptyState
                    title="No invoices Found"
                    description="You haven't added any invoices yet"
                    icon={(<ReceiptText size={64} color="#1E96FC" />)}
                    actions={
                        <Button
                            icon={(<Plus size={18} color="#fff" />)}
                            text="Add New Invoice"
                            event={() => setOpen(true)}
                        />}
                />)
            }
            <CreateInvoice open={open} setOpen={setOpen} />
        </main>
    );
}