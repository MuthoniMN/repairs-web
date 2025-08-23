"use client"

import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import Header from "@/src/components/Header";
import { FileSpreadsheet, Plus, UsersRound } from "lucide-react";
import { useState } from "react";
import CreateContractor from "@/src/components/contractors/CreateContractor";
import { IContractor } from "@/src/types";
import EmptyState from "@/src/components/EmptyState";

export default function ContractorsList() {
    const [open, setOpen] = useState(false);
    const [contractors, setContractors] = useState<IContractor[]>([]);

    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6`}>
            <Header
                title="Contractors"
                description="Manage contractors"
                action={
                    <div className="flex gap-6">
                        <Button
                            icon={(<FileSpreadsheet size={18} color="#1E96FC" />)}
                            text="Import from Excel"
                            type="secondary"
                        />
                        <Button
                            icon={(<Plus size={18} color="#fff" />)}
                            text="Create New Contractor"
                            event={() => setOpen(true)}
                        />
                    </div>
                }
            />

            {
                contractors.length > 0 ? (<></>) : (<EmptyState
                    title="No Contractors Found"
                    description="You haven't added any contractors yet"
                    icon={(<UsersRound size={64} color="#1E96FC" />)}
                    actions={
                        <Button
                            icon={(<Plus size={18} color="#fff" />)}
                            text="Add New Contractor"
                            event={() => setOpen(true)}
                        />}
                />)
            }
            <CreateContractor open={open} setOpen={setOpen} />
        </main>
    );
}