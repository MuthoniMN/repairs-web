"use client"

import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import Header from "@/src/components/Header";
import { Landmark, Plus } from "lucide-react";
import { useState } from "react";
import CreateRecord from "@/src/components/payments/CreateRecord";
import { IPayment } from "@/src/types";
import EmptyState from "@/src/components/EmptyState";

export default function Payments() {
    const [open, setOpen] = useState(false);
    const [payments, setPayments] = useState<IPayment[]>([]);

    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6`}>
            <Header
                title="Payments"
                description="Manage your company finances"
                action={<Button
                    icon={(<Plus size={18} color="#fff" />)}
                    text="Record Payment"
                    event={() => setOpen(true)}
                />}
            />
            {
                payments.length > 0 ? (<></>) : (<EmptyState
                    title="No Payments Found"
                    description="You haven't recorded any payments yet"
                    icon={(<Landmark size={64} color="#1E96FC" />)}
                    actions={
                        <Button
                            icon={(<Plus size={18} color="#fff" />)}
                            text="Record Payment"
                            event={() => setOpen(true)}
                        />}
                />)
            }
            <CreateRecord open={open} setOpen={setOpen} />
        </main>
    );
}