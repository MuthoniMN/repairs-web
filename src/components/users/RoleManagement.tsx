import React, { useState } from 'react';
import { IRole, IPermission } from '../../types';
import { Plus, Edit, Trash2, Shield, Users } from 'lucide-react';

interface RoleManagementProps {
    roles: IRole[];
    permissions: IPermission[];
    onCreateRole: () => void;
    onEditRole: (role: IRole) => void;
    onDeleteRole: (roleId: string) => void;
}

const RoleManagement: React.FC<RoleManagementProps> = ({
    roles,
    permissions,
    onCreateRole,
    onEditRole,
    onDeleteRole
}) => {
    const [expandedRole, setExpandedRole] = useState<string | null>(null);

    const getRoleColor = (roleName: string) => {
        const colors = {
            'Administrator': 'border-red-200 bg-red-50',
            'Manager': 'border-blue-200 bg-blue-50',
            'Technician': 'border-green-200 bg-green-50',
            'Customer Service': 'border-yellow-200 bg-yellow-50'
        };
        return colors[roleName as keyof typeof colors] || 'border-gray-200 bg-gray-50';
    };

    const toggleRoleExpansion = (roleId: string) => {
        setExpandedRole(expandedRole === roleId ? null : roleId);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Role Management</h2>
                    <button
                        onClick={onCreateRole}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Role
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${getRoleColor(role.title)}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <Shield className="w-5 h-5 mr-2 text-gray-600" />
                                    <h3 className="text-sm font-medium text-gray-900">{role.title.replace(role.title[0], role.title[0].toUpperCase())}</h3>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() => onEditRole(role)}
                                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-white transition-colors duration-150"
                                        title="Edit Role"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => role.id && onDeleteRole(role.id)}
                                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-white transition-colors duration-150"
                                        title="Delete Role"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="text-xs text-gray-600 mb-3">
                                <div className="flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <button
                                    onClick={() => toggleRoleExpansion(role.id!)}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    {expandedRole === role.id ? 'Hide' : 'View'} Permissions
                                </button>

                                {expandedRole === role.id && (
                                    <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
                                        {role.permissions.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="text-xs bg-white px-2 py-1 rounded border text-gray-700"
                                            >
                                                {permission.title}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {roles.length === 0 && (
                    <div className="text-center py-12">
                        <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 mb-4">No roles created yet</p>
                        <button
                            onClick={onCreateRole}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-150"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Role
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoleManagement;