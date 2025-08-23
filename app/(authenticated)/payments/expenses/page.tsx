"use client"

import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import Header from "@/src/components/Header";
import { PiggyBank, Plus } from "lucide-react";
import { useState } from "react";
import CreateExpense from "@/src/components/payments/CreateExpense";
import { IExpense } from "@/src/types";
import EmptyState from "@/src/components/EmptyState";
import ExpenseTable from "@/src/components/payments/ExpenseList";

export default function Payments() {
    const [open, setOpen] = useState(false);
    const [expenses, setExpenses] = useState<IExpense[]>([]);

    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6`}>
            <Header
                title="Expenses"
                description="Manage your company expenses"
                action={<Button
                    icon={(<Plus size={18} color="#fff" />)}
                    text="Add an Expense"
                    event={() => setOpen(true)}
                />}
            />
            {
                expenses.length > 0 ? (<ExpenseTable data={expenses} />) : (<EmptyState
                    title="No Expenses Found"
                    description="You haven't added any expenses yet"
                    icon={(<PiggyBank size={64} color="#1E96FC" />)}
                    actions={
                        <Button
                            icon={(<Plus size={18} color="#fff" />)}
                            text="Add New Expense"
                            event={() => setOpen(true)}
                        />}
                />)
            }
            <CreateExpense open={open} setOpen={setOpen} />
        </main>
    );
}