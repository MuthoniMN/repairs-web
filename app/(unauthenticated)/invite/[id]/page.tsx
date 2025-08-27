"use client"

import { getInviteById, updateInvite } from "@/src/actions/invite";
import useInviteStore from "@/src/stores/inviteStore";
import { IInvite, IRole } from "@/src/types";
import { Mail, Building, User, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useShallow } from "zustand/shallow";

const InviteLanding = ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [error, setError] = useState(false);
    const { setInvite, invite } = useInviteStore(
        useShallow((state) => ({ invite: state.invite, setInvite: state.setInvite }))
    );
    const router = useRouter();
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getInviteById((await params).id);
            console.log(res);

            if (res.success) {
                setInvite(res.data);
            }
        }
        fetchData();
    });

    const handleAcceptInvite = async () => {
        try {
            const res = await updateInvite(invite?.id as string, {
                expiresAt: (new Date()).toLocaleDateString()
            } as IInvite);

            if (!res.success) {
                console.error(res.error);
                setError(true);
                return;
            }

            router.push('/create-password');
            /* eslint-disable @typescript-eslint/no-unused-vars */
        } catch (error) {
            setError(true);
            return;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 w-full shadow-md rounded-lg">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">You&apos;re Invited!</h1>
                    <p className="text-gray-600">
                        You&apos;ve been invited to join <strong>{invite?.company?.companyName}</strong>
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Building className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{invite?.company?.companyName}</p>
                                <p className="text-sm text-gray-500">Organization</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{invite?.invited_by?.name}</p>
                                <p className="text-sm text-gray-500">{(invite?.invited_by?.role as IRole).title || 'Admin'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{invite?.email}</p>
                                <p className="text-sm text-gray-500">Role: {invite?.role ? (invite?.role as IRole).title : 'Contractor'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button onClick={() => startTransition(() => handleAcceptInvite())}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <CheckCircle className="w-5 h-5" />
                        Accept Invitation
                    </button>

                    <Link href={`/invite/reject`}
                        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <XCircle className="w-5 h-5" />
                        Decline Invitation
                    </Link>
                </div>

                <p className="text-xs text-gray-500 text-center mt-6">
                    This invitation expires on {new Date(invite?.expiresAt || '').toLocaleDateString()}
                </p>
            </div>
        </div>
    );
}

export default InviteLanding;