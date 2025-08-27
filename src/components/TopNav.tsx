"use client"

import { Bell, ChevronDown, User } from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import useAuthStore from "../stores/authStore";
import Image from "next/image";
import { dmSans } from "../assets/fonts";

export default function TopNav() {
    const { user } = useAuthStore();

    return (
        <div className="flex justify-between items-center shadow-sm py-2 px-8">
            <GlobalSearch />
            <div className="flex gap-4 items-center">
                <Bell size={24} color="#000" />
                <div className="flex gap-4 border-2 border-slate-200 hover: border-slate-300 bg-white items-center text-black py-1 px-2 rounded-full">
                    {
                        user?.profilePicture ?
                            <Image
                                src={user.profilePicture}
                                width={50}
                                height={50}
                                alt={user.name}
                                className="rounded-full"
                            />
                            : <div className="flex justify-center items-center w-[40px] h-[40px] rounded-full bg-blue-100">
                                <User size={24} color="#000" />
                            </div>
                    }
                    <p className={`${dmSans.className} text-md font-medium`}>{user?.name}</p>
                    <ChevronDown />
                </div>
            </div>
        </div>
    );
}