"use client"

import Sidebar from "@/src/components/Sidebar";
import TopNav from "@/src/components/TopNav";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-screen overflow-y-hidden h-screen flex bg-white">
            <Sidebar />
            <div className="grow h-screen overflow-y-hidden flex flex-col gap-2">
                <TopNav />
                <div className="grow overflow-y-scroll">{children}</div>
            </div>
        </div>
    );
}
