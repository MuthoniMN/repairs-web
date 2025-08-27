"use client"

import React, { useState, useEffect } from 'react';
import { Plus, Mail, Clock, CheckCircle, XCircle, Users, Search, Trash2, RefreshCw, Send } from 'lucide-react';
import { IInvite, IRole } from '@/src/types';
import { createInvite, getAllInvites } from '@/src/actions/invite';
import { getAllRoles } from '@/src/actions/role';
import Button from '@/src/components/Button';
import Header from '@/src/components/Header';
import useAuthStore from '@/src/stores/authStore';

export default function UserManagementPage() {
    const [invites, setInvites] = useState<IInvite[]>([]);
    const [roles, setRoles] = useState<IRole[]>([]);
    const [filteredInvites, setFilteredInvites] = useState<IInvite[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const itemsPerPage = 10;

    // Invite form state
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        if (!accessToken) return;

        const fetchData = async () => {
            const res = await getAllInvites(accessToken);
            const results = await getAllRoles(accessToken);

            if (res.success) {
                setInvites(res.data);
            }
            if (results.success) {
                setRoles(results.data);
            }
            setLoading(false)
        }

        fetchData()
    }, [accessToken]);

    useEffect(() => {
        let filtered = invites;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(invite =>
                invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (invite.role as IRole).title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(invite => {
                const now = new Date();
                const expiresAt = new Date(invite.expiresAt);

                switch (statusFilter) {
                    case 'pending':
                        return !invite.used && expiresAt > now;
                    case 'accepted':
                        return invite.used;
                    case 'expired':
                        return !invite.used && expiresAt <= now;
                    default:
                        return true;
                }
            });
        }

        // Role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter(invite => (invite.role as IRole).id === roleFilter);
        }

        setFilteredInvites(filtered);
        setCurrentPage(1);
    }, [invites, searchTerm, statusFilter, roleFilter]);

    const handleSendInvite = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        if (!inviteEmail || !selectedRole) return;

        setInviteLoading(true);

        const res = await createInvite({
            email: inviteEmail,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            role: selectedRole,
        }, accessToken);

        if (res.success) {
            setInviteEmail('');
            setSelectedRole('');
            setShowInviteForm(false);
            setInviteLoading(false);
        }
    };

    const handleResendInvite = (inviteId: string) => {
        setInvites(invites.map(invite =>
            invite.id === inviteId
                ? { ...invite, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }
                : invite
        ));
    };

    const handleDeleteInvite = (inviteId: string) => {
        setInvites(invites.filter(invite => invite.id !== inviteId));
    };

    const getInviteStatus = (invite: IInvite) => {
        if (invite.used) return { status: 'accepted', color: 'text-green-600 bg-green-50' };

        const now = new Date();
        const expiresAt = new Date(invite.expiresAt);

        if (expiresAt <= now) return { status: 'expired', color: 'text-red-600 bg-red-50' };
        return { status: 'pending', color: 'text-yellow-600 bg-yellow-50' };
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Pagination
    const totalPages = Math.ceil(filteredInvites.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentInvites = filteredInvites.slice(startIndex, endIndex);

    const getPaginationRange = () => {
        const range = [];
        const showEllipsis = totalPages > 7;

        if (!showEllipsis) {
            for (let i = 1; i <= totalPages; i++) range.push(i);
            return range;
        }

        if (currentPage <= 4) {
            for (let i = 1; i <= 5; i++) range.push(i);
            range.push('...', totalPages);
        } else if (currentPage >= totalPages - 3) {
            range.push(1, '...');
            for (let i = totalPages - 4; i <= totalPages; i++) range.push(i);
        } else {
            range.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }

        return range;
    };

    console.log(invites, roles);


    return (
        <div className="min-h-screen p-6 text-black">
            <div className="flex flex-col gap-6">
                <Header
                    description='Invite users and manage their roles and permissions'
                    title='User Management'
                    action={
                        (<Button
                            event={() => setShowInviteForm(!showInviteForm)}
                            classNames="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            icon={<Plus className="w-4 h-4" />}
                            text='Invite User'
                        />)}
                />

                {/* Invite Form */}
                {showInviteForm && (
                    <div className="border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role
                                </label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select a role</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.id}>{role.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <Button
                                    event={handleSendInvite}
                                    disabled={inviteLoading}
                                    classNames="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    icon={inviteLoading ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    text={inviteLoading ? 'Sending...' : 'Send Invite'}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters and Search */}
                <div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by email or role..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="expired">Expired</option>
                            </select>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Roles</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.title}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Invites Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Sent Invites</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredInvites.length} invite{filteredInvites.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-500">Loading invites...</p>
                        </div>
                    ) : filteredInvites.length === 0 ? (
                        <div className="p-8 text-center">
                            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No invites found</h3>
                            <p className="text-gray-500 mb-4">
                                {invites.length === 0
                                    ? "You haven't sent any invites yet. Start by inviting your first user!"
                                    : "No invites match your current filters. Try adjusting your search criteria."
                                }
                            </p>
                            {invites.length === 0 && (
                                <Button
                                    event={() => setShowInviteForm(true)}
                                    classNames="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    icon={<Plus className="w-4 h-4" />}
                                    text='Send First Invite'
                                />
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Sent
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Expires
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentInvites.map((invite) => {
                                            const { status, color } = getInviteStatus(invite);
                                            return (
                                                <tr key={invite.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                                <Mail className="w-5 h-5 text-gray-500" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {invite.email}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    Invited by {invite.invited_by?.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {(invite.role as IRole).title}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                                                            {status === 'accepted' && <CheckCircle className="w-3 h-3" />}
                                                            {status === 'expired' && <XCircle className="w-3 h-3" />}
                                                            {status === 'pending' && <Clock className="w-3 h-3" />}
                                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(invite.created_at!)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(invite.expiresAt)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {status === 'pending' && (
                                                                <Button
                                                                    event={() => handleResendInvite(invite.id!)}
                                                                    classNames="text-blue-600 hover:text-blue-900 p-1"
                                                                    text="Resend invite"
                                                                    icon={<RefreshCw className="w-4 h-4" />}
                                                                />
                                                            )}
                                                            <Button
                                                                event={() => handleDeleteInvite(invite.id!)}
                                                                classNames="text-red-600 hover:text-red-900 p-1"
                                                                text="Delete invite"
                                                                icon={<Trash2 className="w-4 h-4" />}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing {startIndex + 1} to {Math.min(endIndex, filteredInvites.length)} of {filteredInvites.length} results
                                        </div>
                                        <nav className="flex items-center space-x-2">
                                            <Button
                                                event={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                                classNames="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                text='Previous'
                                            />

                                            {getPaginationRange().map((page, index) => (
                                                <Button
                                                    key={index}
                                                    event={() => typeof page === 'number' && setCurrentPage(page)}
                                                    disabled={page === '...'}
                                                    classNames={`px-3 py-2 text-sm font-medium rounded-md ${page === currentPage
                                                        ? 'bg-blue-600 text-white'
                                                        : page === '...'
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    text={`${page}`}
                                                />
                                            ))}

                                            <Button
                                                event={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage === totalPages}
                                                classNames="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                text='Next'
                                            />
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}