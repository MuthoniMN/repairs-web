"use client"

import useInviteStore from "@/src/stores/inviteStore";
import { XCircle } from "lucide-react";
import Link from "next/link";

const RejectedState = () => {
    const { invite } = useInviteStore();
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 shadow-md rounded-lg">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-gray-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Invitation Declined</h1>
                <p className="text-gray-600 mb-8">
                    You have successfully declined the invitation to join {invite?.company?.name}.
                    This invitation link is no longer valid.
                </p>
                <Link href='/'
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                >
                    Go to Home Page
                </Link>
            </div>
        </div>
    );
};

export default RejectedState;