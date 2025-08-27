import { Cog } from "lucide-react";
import { dmSans } from "../assets/fonts";

export default function Logo() {
    return (
        <div className="flex gap-4 items-center p-2">
            <Cog size={32} color="#1E2EDE" />
            <h1 className={`text-2xl text-black ${dmSans.className} hidden md:block font-semibold`} >Repaired</h1>
        </div>
    )
}