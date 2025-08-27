import React, { useState, useEffect } from 'react';
import { IPermission } from '../../types';
import { X, Key } from 'lucide-react';

interface PermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (permission: IPermission) => void;
    permission?: IPermission;
}

const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, onClose, onSave, permission }) => {
    const [formData, setFormData] = useState<IPermission>({
        id: '',
        title: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    useEffect(() => {
        if (permission) {
            setFormData(permission);
        } else {
            setFormData({
                id: '',
                title: '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }
    }, [permission]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPermission: IPermission = {
            ...formData,
            id: formData.id || `perm-${Date.now()}`,
            updated_at: new Date().toISOString()
        };
        onSave(newPermission);
        onClose();
    };

    if (!isOpen) return null;

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
                                    <Key className="w-5 h-5 mr-2" />
                                    {permission ? 'Edit Permission' : 'Create New Permission'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-150"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="permissionText" className="block text-sm font-medium text-gray-700 mb-1">
                                        Permission Name
                                    </label>
                                    <input
                                        type="text"
                                        id="permissionText"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        placeholder="e.g., Manage Customer Data"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Enter a clear, descriptive name for this permission
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                            >
                                {permission ? 'Update' : 'Create'} Permission
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

export default PermissionModal;