"use client"

import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import Header from "@/src/components/Header";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateExpense from "@/src/components/payments/CreateExpense";
import ExpenseTable from "@/src/components/payments/ExpenseList";

export default function Payments() {
    const [open, setOpen] = useState(false);
    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6 flex flex-col justify-between gap-8 py-2`}>
            <Header
                title="Expenses"
                description="Manage your company expenses"
                action={<Button
                    icon={(<Plus size={18} color="#fff" />)}
                    text="Add an Expense"
                    event={() => setOpen(true)}
                />}
            />
            <ExpenseTable />
            <CreateExpense open={open} setOpen={setOpen} />
        </main>
    );
}