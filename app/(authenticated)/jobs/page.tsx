"use client"

import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import CreateJob from "@/src/components/jobs/CreateJob";
import Header from "@/src/components/Header";
import { Pickaxe, Plus } from "lucide-react";
import { useState } from "react";
import { IJob } from "@/src/types";
import EmptyState from "@/src/components/EmptyState";

export default function JobsList() {
    const [open, setOpen] = useState(false);
    const [jobs, setJobs] = useState<IJob[]>([]);

    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6`}>
            <Header
                title="Jobs"
                description="Manage repair jobs and track progress"
                action={<Button
                    icon={(<Plus size={18} color="#fff" />)}
                    text="Create New Job"
                    event={() => setOpen(true)}
                />}
            />

            {
                jobs.length > 0 ? (<></>) : (<EmptyState
                    title="No jobs found"
                    description="You haven't added any jobs yet"
                    icon={(<Pickaxe size={64} color="#1E96FC" />)}
                    actions={
                        <Button
                            icon={(<Plus size={18} color="#fff" />)}
                            text="Create a Job"
                            event={() => setOpen(true)}
                        />}
                />)
            }
            <CreateJob open={open} setOpen={setOpen} />
        </main>
    );
}