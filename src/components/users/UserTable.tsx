import React, { useState } from 'react';
import { IUser, IRole } from '../../types';
import { UserCheck, Trash2, Shield, Search, User2 } from 'lucide-react';
import Image from 'next/image';

interface UserTableProps {
    users: IUser[];
    roles: IRole[];
    onReassignRole: (user: IUser) => void;
    onDeleteUser: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, roles, onReassignRole, onDeleteUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || (user.role as IRole)?.id === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (roleName: string) => {
        const colors = {
            'Administrator': 'bg-red-100 text-red-800',
            'Manager': 'bg-blue-100 text-blue-800',
            'Technician': 'bg-green-100 text-green-800',
            'Customer Service': 'bg-yellow-100 text-yellow-800'
        };
        return colors[roleName as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                        />
                    </div>

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Roles</option>
                        {roles.map(role => (
                            <option key={role.id} value={role.id}>
                                {role.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {user.profilePicture ?
                                            (<Image
                                                src={user.profilePicture}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />) :
                                            <div className='bg-gray-200 flex justify-center items-center w-[32px] h-[32px] rounded-full'>
                                                <User2 size={20} />
                                            </div>
                                        }
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{user.phoneNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.role ? (
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor((user.role as IRole).title)}`}>
                                            <Shield className="w-3 h-3 mr-1" />
                                            {(user.role as IRole).title}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 text-sm">No role assigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onReassignRole(user)}
                                            className="text-green-600 hover:text-green-900 transition-colors duration-150 p-1 rounded hover:bg-green-50"
                                            title="Reassign Role"
                                        >
                                            <UserCheck className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => user.id && onDeleteUser(user.id)}
                                            className="text-red-600 hover:text-red-900 transition-colors duration-150 p-1 rounded hover:bg-red-50"
                                            title="Delete User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="px-6 py-12 text-center">
                    <p className="text-gray-500">No users found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default UserTable;