"use client"

import { sendOtp } from "@/src/actions/auth";
import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import Logo from "@/src/components/Logo";
import Modal from "@/src/components/ResponseModal";
import useAuthStore from "@/src/stores/authStore";
import { MailPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function RequestOTP() {
    const { user } = useAuthStore();
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleRequest = async () => {
        try {
            const res = await sendOtp(user?.email as string);

            if (!res.success) {
                setError(true);
                return;
            }

            router.push('/verify/otp');
        } catch (error) {
            console.error(error);
            setError(true);
        }
    }

    return (
        <div className="bg-white shadow-md w-9/10 md:w-3/5 lg:w-2/5 max-w-3xl px-6 gap-4 py-10 flex flex-col items-center rounded-lg text-center">
            <Logo />
            <h1 className={`${dmSans.className} text-xl font-bold text-black text-center`} >Verify your Email</h1>
            <p className="text-black">Please verify your email as it will be a primary source of communication.</p>
            <Button
                text="Request Verification Code"
                icon={<MailPlus size={18} color="#fff" />}
                event={() => startTransition(() => handleRequest())}
            />

            <Modal type="error" title="Failed to send verification code" message="We encountered an issue while attempting to send your verification code. Please try again!" isOpen={error} onClose={() => setError(false)} />
        </div>
    )
}