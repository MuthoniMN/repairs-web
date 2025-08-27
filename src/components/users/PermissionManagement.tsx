import React from 'react';
import { IPermission } from '../../types';
import { Plus, Edit, Trash2, Key } from 'lucide-react';

interface PermissionManagementProps {
  permissions: IPermission[];
  onCreatePermission: () => void;
  onEditPermission: (permission: IPermission) => void;
  onDeletePermission: (permissionId: string) => void;
}

const PermissionManagement: React.FC<PermissionManagementProps> = ({
  permissions,
  onCreatePermission,
  onEditPermission,
  onDeletePermission
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Permission Management</h2>
          <button
            onClick={onCreatePermission}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Permission
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {permissions.map((permission) => (
            <div
              key={permission.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200 hover:bg-gray-100"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Key className="w-4 h-4 mr-2 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {permission.title}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEditPermission(permission)}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-white transition-colors duration-150"
                    title="Edit Permission"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDeletePermission(permission.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-white transition-colors duration-150"
                    title="Delete Permission"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Created: {new Date(permission.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {permissions.length === 0 && (
          <div className="text-center py-12">
            <Key className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No permissions created yet</p>
            <button
              onClick={onCreatePermission}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors duration-150"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create First Permission
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionManagement;