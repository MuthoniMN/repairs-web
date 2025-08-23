"use client"

import { Search } from "lucide-react";
import { useState } from "react";
import { dmSans } from "../assets/fonts";

export default function GlobalSearch() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className=" w-2/5">
            <div className="bg-blue-50 py-2 px-6 rounded-full flex gap-4 items-center" >
                <Search size={18} color="#000" />
                <input
                    type="text"
                    value={searchTerm}
                    placeholder="Search for job, invoice, product or payment"
                    className={`${dmSans.className} text-black w-full hidden md:block`}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}