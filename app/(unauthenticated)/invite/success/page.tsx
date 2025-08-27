"use client"

import useInviteStore from "@/src/stores/inviteStore";
import { CheckCircle } from "lucide-react";

const SuccessState = () => {
    const { invite } = useInviteStore();
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4 shadow-md rounded-lg">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to {invite?.company?.companyName}!</h1>
                <p className="text-gray-600 mb-8">
                    Your account has been created successfully. You can now access your dashboard and start collaborating with your team.
                </p>
                <button
                    onClick={() => {
                        // In real app, redirect to dashboard
                        alert('Redirecting to dashboard...');
                    }}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );
}

export default SuccessState;