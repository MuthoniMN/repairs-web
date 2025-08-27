"use client"

import { updateInvite } from "@/src/actions/invite";
import Modal from "@/src/components/ResponseModal";
import useInviteStore from "@/src/stores/inviteStore";
import { IInvite } from "@/src/types";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

const RejectInvite = () => {
    const { invite } = useInviteStore();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState(false);
    const router = useRouter();

    const handleRejectInvite = async () => {
        try {
            const res = await updateInvite(invite?.id as string, {
                expiresAt: (new Date()).toLocaleDateString()
            } as IInvite);

            if (!res.success) {
                console.error(res.error);
                setError(true);
                return;
            }

            router.push('/invite/decline');
        } catch (error) {
            console.error(error);
            setError(true);
            return;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full rounded-lg">
            <div className="text-center mb-8">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Decline Invitation</h1>
                <p className="text-gray-600">
                    Are you sure you want to decline this invitation to join <strong>{invite?.company?.name}</strong>?
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-600">
                    Once declined, you'll need to be invited again if you change your mind.
                    The invitation link will no longer work.
                </p>
            </div>

            <div className="flex gap-3">
                <Link href={`/invite/${invite?.id}`}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex justify-center items-center"
                >
                    Cancel
                </Link>
                <button
                    onClick={() => startTransition(() => handleRejectInvite())}
                    disabled={isPending}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-6"
                >
                    {isPending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <XCircle className="w-5 h-5" />
                            <p className="grow text-left">Decline Invitation</p>
                        </>
                    )}
                </button>
            </div>
            <Modal isOpen={error} onClose={() => setError(false)} title="Failed to reject invite" message="We couldn't process your request. Please try again in a few minutes." type="error" />
        </div>
    );
}

export default RejectInvite;