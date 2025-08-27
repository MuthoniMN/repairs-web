import React, { useState, useEffect } from 'react';
import { IUser, IRole } from '../../types';
import { X, UserCheck, Shield } from 'lucide-react';

interface RoleReassignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: IUser, newRole: IRole | undefined) => void;
    user?: IUser;
    roles: IRole[];
}

const RoleReassignModal: React.FC<RoleReassignModalProps> = ({ isOpen, onClose, onSave, user, roles }) => {
    const [selectedRoleId, setSelectedRoleId] = useState<string>('');

    useEffect(() => {
        if (user) {
            setSelectedRoleId((user.role as IRole)?.id || '');
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const newRole = selectedRoleId ? roles.find(role => role.id === selectedRoleId) : undefined;
        onSave(user, newRole);
        onClose();
    };

    if (!isOpen || !user) return null;

    const currentRole = user.role;
    const selectedRole = selectedRoleId ? roles.find(role => role.id === selectedRoleId) : undefined;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity z-[-10]" onClick={onClose}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75 backdrop-blur-sm"></div>
                </div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <UserCheck className="w-5 h-5 mr-2 text-green-600" />
                                    Reassign User Role
                                </h3>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <img
                                            src={user.profilePicture}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Role
                                    </label>
                                    <div className="flex items-center p-3 bg-gray-50 rounded-md">
                                        <Shield className="w-4 h-4 mr-2 text-gray-500" />
                                        <span className="text-sm text-gray-700">
                                            {currentRole ? (currentRole as IRole).title : 'No role assigned'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="newRole" className="block text-sm font-medium text-gray-700 mb-2">
                                        New Role
                                    </label>
                                    <select
                                        id="newRole"
                                        value={selectedRoleId}
                                        onChange={(e) => setSelectedRoleId(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="">Remove role access</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>
                                                {role.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedRole && (
                                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                        <h4 className="text-sm font-medium text-green-800 mb-2">New Role Permissions:</h4>
                                        <div className="space-y-1 max-h-32 overflow-y-auto">
                                            {selectedRole.permissions.map((permission) => (
                                                <div key={permission.id} className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                                                    {permission.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedRoleId === '' && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                        <p className="text-sm text-yellow-800">
                                            <strong>Warning:</strong> Removing the user role will revoke all their access permissions.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                            >
                                Reassign Role
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-150"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RoleReassignModal;