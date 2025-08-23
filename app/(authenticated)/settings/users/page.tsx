import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import Header from "@/src/components/Header";
import { UserPlus } from "lucide-react";

export default function Users() {
    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6`}>
            <Header
                title="User Management"
                description="Invite your team and assign roles"
                action={
                    <Button
                        text="Invite team members"
                        icon={<UserPlus size={16} color="#fff" />}
                    />
                }
            />
        </main>
    )
}