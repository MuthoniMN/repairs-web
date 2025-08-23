import { dmSans } from "@/src/assets/fonts";
import Header from "@/src/components/Header";

export default function Users() {
    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6`}>
            <Header
                title="Company Profile"
                description="Edit your company profile and customize your workspace"
            />
        </main>
    )
}