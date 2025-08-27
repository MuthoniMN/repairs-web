"use client"

import { getAllClients } from "@/src/actions/client";
import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import ClientsTable from "@/src/components/clients/ClientTable";
import CreateClient from "@/src/components/clients/CreateClient";
import EmptyState from "@/src/components/EmptyState";
import Header from "@/src/components/Header";
import { IClient } from "@/src/types";
import { ContactRound, FileSpreadsheet, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<IClient>({} as IClient);

    const handleEdit = (client: IClient) => {
        setOpen(true)
        setSelected(client)
    }

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
            <ClientsTable onEdit={handleEdit} refresh={!open} />
            <CreateClient
                open={open}
                setOpen={setOpen}
                user={selected.id ? selected : undefined}
            />
        </main>
    )
}