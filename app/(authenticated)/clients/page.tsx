"use client"

import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import CreateClient from "@/src/components/clients/CreateClient";
import EmptyState from "@/src/components/EmptyState";
import Header from "@/src/components/Header";
import { IClient } from "@/src/types";
import { ContactRound, FileSpreadsheet, Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const [open, setOpen] = useState(false);
    const [clients, setClients] = useState<IClient[]>([]);

    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6`}>
            <Header
                title="Clients"
                description="Manage your clients and the contact book"
                action={
                    <div className="flex gap-6">
                        <Button
                            icon={(<FileSpreadsheet size={18} color="#1E96FC" />)}
                            text="Import from Excel"
                            type="secondary"
                        />
                        <Button
                            icon={(<Plus size={18} color="#fff" />)}
                            text="Add Client"
                            event={() => setOpen(true)}
                        />
                    </div>}
            />
            {
                clients.length > 0 ? (<></>) : (<EmptyState
                    title="No Clients Found"
                    description="You haven't added any clients yet"
                    icon={(<ContactRound size={64} color="#1E96FC" />)}
                    actions={
                        <Button
                            icon={(<Plus size={18} color="#fff" />)}
                            text="Add New Client"
                            event={() => setOpen(true)}
                        />}
                />)
            }
            <CreateClient
                open={open}
                setOpen={setOpen}
            />
        </main>
    )
}