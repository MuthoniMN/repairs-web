"use client"

import { DashboardSummary } from '../../types/';
import { Package, AlertTriangle, DollarSign } from 'lucide-react';

interface InventoryStatusProps {
    data: DashboardSummary['inventory'];
}

const InventoryStatus: React.FC<InventoryStatusProps> = ({ data }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Inventory Status</h3>

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                            <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Total Stock Value</p>
                            <p className="text-xl font-bold text-blue-900">
                                ${data.totalStockValue.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="bg-orange-100 p-2 rounded-lg mr-3">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-orange-600 font-medium">Low Stock Items</p>
                            <p className="text-xl font-bold text-orange-900">
                                {data.lowStockCount}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {data.lowStockProducts.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <Package className="w-4 h-4 mr-2" />
                        Items Requiring Attention
                    </h4>
                    <div className="space-y-2">
                        {data.lowStockProducts.map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{product.title}</p>
                                    <p className="text-xs text-gray-500">
                                        Reorder at: {product.reorderLevel} units
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.quantity <= product.reorderLevel / 2
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-orange-100 text-orange-800'
                                        }`}>
                                        {product.quantity} left
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryStatus;