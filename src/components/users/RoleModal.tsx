import React, { useState, useEffect } from 'react';
import { IRole, IPermission } from '../../types';
import { X, Shield, Check } from 'lucide-react';

interface RoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (role: IRole) => void;
    role?: IRole;
    permissions: IPermission[];
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, onSave, role, permissions }) => {
    const [formData, setFormData] = useState<IRole>({
        title: '',
        description: '',
        permissions: [],
        created_at: new Date().toISOString()
    });

    useEffect(() => {
        if (role) {
            setFormData(role);
        } else {
            setFormData({
                title: '',
                description: '',
                permissions: [],
                created_at: new Date().toISOString()
            });
        }
    }, [role]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            updated_at: new Date().toISOString()
        });
        onClose();
    };

    const togglePermission = (permission: IPermission) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.some(p => p.id === permission.id)
                ? prev.permissions.filter(p => p.id !== permission.id)
                : [...prev.permissions, permission]
        }));
    };

    const isPermissionSelected = (permissionId: string) => {
        return formData.permissions.some(p => p.id === permissionId);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity z-[-10]" onClick={onClose}>
                    <div className="absolute inset-0 bg-gray-500 opacity-75 backdrop-blur-sm"></div>
                </div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                    <Shield className="w-5 h-5 mr-2" />
                                    {role ? 'Edit Role' : 'Create New Role'}
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
                                <div>
                                    <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Role Name
                                    </label>
                                    <input
                                        type="text"
                                        id="roleName"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g., Senior Technician"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Assign Permissions
                                    </label>
                                    <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
                                        <div className="grid grid-cols-1 gap-2">
                                            {permissions.map((permission) => (
                                                <label
                                                    key={permission.id}
                                                    className="flex items-center p-2 hover:bg-white rounded cursor-pointer transition-colors duration-150"
                                                >
                                                    <div className="relative">
                                                        <input
                                                            type="checkbox"
                                                            checked={isPermissionSelected(permission.id)}
                                                            onChange={() => togglePermission(permission)}
                                                            className="sr-only"
                                                        />
                                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 ${isPermissionSelected(permission.id)
                                                            ? 'bg-blue-600 border-blue-600'
                                                            : 'bg-white border-gray-300 hover:border-blue-500'
                                                            }`}>
                                                            {isPermissionSelected(permission.id) && (
                                                                <Check className="w-3 h-3 text-white" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="ml-3 text-sm text-gray-700">{permission.title}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-500">
                                        {formData.permissions.length} permission{formData.permissions.length !== 1 ? 's' : ''} selected
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                            >
                                {role ? 'Update' : 'Create'} Role
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

export default RoleModal;