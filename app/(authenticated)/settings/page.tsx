import { dmSans } from "@/src/assets/fonts";
import Header from "@/src/components/Header";

export default function Settings() {
    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6`}>
            <Header
                title="Settings"
                description="Manage your workspace"
            />
        </main>
    )
}