"use client"

import React, { useEffect, useState } from 'react';
import { IUser, IRole, IPermission } from '@/src/types';
import UserTable from '@/src/components/users/UserTable';
import RoleManagement from '@/src/components/users/RoleManagement';
import PermissionManagement from '@/src/components/users/PermissionManagement';
import RoleReassignModal from '@/src/components/users/ReassignRoleModal';
import DeleteUserModal from '@/src/components/users/DeleteUser';
import RoleModal from '@/src/components/users/RoleModal';
import PermissionModal from '@/src/components/users/PermissionModal';
import { Users, Shield, Key, Settings } from 'lucide-react';
import { getAllUsers } from '@/src/actions/user';
import { getAllPermissions, getAllRoles } from '@/src/actions/role';
import useAuthStore from '@/src/stores/authStore'; // Import the auth store

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [roles, setRoles] = useState<IRole[]>([]);
    const [permissions, setPermissions] = useState<IPermission[]>([]);

    const { accessToken } = useAuthStore.getState(); // Get the access token

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllUsers(accessToken); // Pass the access token
            const results = await getAllRoles(accessToken); // Pass the access token
            const result = await getAllPermissions(accessToken); // Pass the access token

            if (res.success) {
                setUsers(res.data);
            }
            if (results.success) {
                setRoles(results.data);
            }
            if (result.success) {
                setPermissions(result.data)
            }
        }

        fetchData()
    }, [accessToken]);

    const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'permissions'>('users');
    const [isRoleReassignModalOpen, setIsRoleReassignModalOpen] = useState(false);
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | undefined>();
    const [editingRole, setEditingRole] = useState<IRole | undefined>();
    const [editingPermission, setEditingPermission] = useState<IPermission | undefined>();

    const handleReassignRole = (user: IUser) => {
        setSelectedUser(user);
        setIsRoleReassignModalOpen(true);
    };

    const handleDeleteUser = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setSelectedUser(user);
            setIsDeleteUserModalOpen(true);
        }
    };

    const handleConfirmDeleteUser = () => {
        if (selectedUser?.id) {
            setUsers(users.filter(user => user.id !== selectedUser.id));
        }
    };

    const handleSaveRoleReassignment = (user: IUser, newRole: IRole | undefined) => {
        setUsers(users.map(u =>
            u.id === user.id
                ? { ...u, role: newRole, updated_at: new Date().toISOString() }
                : u
        ));
    };

    const handleCreateRole = () => {
        setEditingRole(undefined);
        setIsRoleModalOpen(true);
    };

    const handleEditRole = (role: IRole) => {
        setEditingRole(role);
        setIsRoleModalOpen(true);
    };

    const handleDeleteRole = (roleId: string) => {
        if (window.confirm('Are you sure you want to delete this role? Users with this role will lose their access.')) {
            setRoles(roles.filter(role => role.id !== roleId));
            // Update users who had this role
            setUsers(users.map(user =>
                user.role === roleId || (user.role as IRole)?.id === roleId
                    ? { ...user, role: undefined }
                    : user
            ));
        }
    };

    const handleSaveRole = (roleData: IRole) => {
        if (editingRole) {
            setRoles(roles.map(role =>
                role.id === editingRole.id
                    ? { ...roleData, id: editingRole.id }
                    : role
            ));
        } else {
            const newRole: IRole = {
                ...roleData,
                id: `role-${Date.now()}`
            };
            setRoles([...roles, newRole]);
        }
        setEditingRole(undefined);
    };

    const handleCreatePermission = () => {
        setEditingPermission(undefined);
        setIsPermissionModalOpen(true);
    };

    const handleEditPermission = (permission: IPermission) => {
        setEditingPermission(permission);
        setIsPermissionModalOpen(true);
    };

    const handleDeletePermission = (permissionId: string) => {
        if (window.confirm('Are you sure you want to delete this permission? It will be removed from all roles.')) {
            setPermissions(permissions.filter(permission => permission.id !== permissionId));
            // Remove permission from all roles
            setRoles(roles.map(role => ({
                ...role,
                permissions: role.permissions.filter(p => p.id !== permissionId)
            })));
        }
    };

    const handleSavePermission = (permissionData: IPermission) => {
        if (editingPermission) {
            setPermissions(permissions.map(permission =>
                permission.id === editingPermission.id
                    ? permissionData
                    : permission
            ));
            // Update the permission in all roles that have it
            setRoles(roles.map(role => ({
                ...role,
                permissions: role.permissions.map(p =>
                    p.id === editingPermission.id ? permissionData : p
                )
            })));
        } else {
            setPermissions([...permissions, permissionData]);
        }
        setEditingPermission(undefined);
    };

    const tabs = [
        { id: 'users', label: 'Users', icon: Users, count: users.length },
        { id: 'roles', label: 'Roles', icon: Shield, count: roles.length },
        { id: 'permissions', label: 'Permissions', icon: Key, count: permissions.length }
    ] as const;

    return (
        <div className="min-h-screen text-black">
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center">
                            <Settings className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                                <p className="text-sm text-gray-600 mt-1">Manage users, roles, and permissions</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <Icon className="w-4 h-4 mr-2" />
                                            {tab.label}
                                            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                                {tab.count}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'users' && (
                    <UserTable
                        users={users}
                        roles={roles}
                        onReassignRole={handleReassignRole}
                        onDeleteUser={handleDeleteUser}
                    />
                )}

                {activeTab === 'roles' && (
                    <RoleManagement
                        roles={roles}
                        permissions={permissions}
                        onCreateRole={handleCreateRole}
                        onEditRole={handleEditRole}
                        onDeleteRole={handleDeleteRole}
                    />
                )}

                {activeTab === 'permissions' && (
                    <PermissionManagement
                        permissions={permissions}
                        onCreatePermission={handleCreatePermission}
                        onEditPermission={handleEditPermission}
                        onDeletePermission={handleDeletePermission}
                    />
                )}
            </div>

            <RoleReassignModal
                isOpen={isRoleReassignModalOpen}
                onClose={() => {
                    setIsRoleReassignModalOpen(false);
                    setSelectedUser(undefined);
                }}
                onSave={handleSaveRoleReassignment}
                user={selectedUser}
                roles={roles}
            />

            <DeleteUserModal
                isOpen={isDeleteUserModalOpen}
                onClose={() => {
                    setIsDeleteUserModalOpen(false);
                    setSelectedUser(undefined);
                }}
                onConfirm={handleConfirmDeleteUser}
                user={selectedUser}
            />

            <RoleModal
                isOpen={isRoleModalOpen}
                onClose={() => {
                    setIsRoleModalOpen(false);
                    setEditingRole(undefined);
                }}
                onSave={handleSaveRole}
                role={editingRole}
                permissions={permissions}
            />

            <PermissionModal
                isOpen={isPermissionModalOpen}
                onClose={() => {
                    setIsPermissionModalOpen(false);
                    setEditingPermission(undefined);
                }}
                onSave={handleSavePermission}
                permission={editingPermission}
            />
        </div>
    );
};

export default UserManagement;