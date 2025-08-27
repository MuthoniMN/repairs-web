"use client"
import { DashboardSummary } from '../../types/';
import { AlertTriangle, Package, Clock } from 'lucide-react';

interface AlertsPanelProps {
    data: DashboardSummary['alerts'];
    lowStockProducts: DashboardSummary['inventory']['lowStockProducts'];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ data, lowStockProducts }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
                <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
            </div>

            <div className="space-y-6">
                {/* Overdue Invoices */}
                {data.overdueInvoices.length > 0 && (
                    <div>
                        <div className="flex items-center mb-3">
                            <Clock className="w-4 h-4 text-red-500 mr-2" />
                            <h4 className="text-sm font-medium text-gray-900">
                                Overdue Invoices ({data.overdueInvoices.length})
                            </h4>
                        </div>
                        <div className="space-y-2">
                            {data.overdueInvoices.slice(0, 3).map((invoice) => (
                                <div key={invoice.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-red-900">{invoice.ref}</p>
                                            <p className="text-xs text-red-700">
                                                Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-red-900">
                                            ${invoice.amount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Low Stock Items */}
                {data.lowStockCount > 0 && (
                    <div>
                        <div className="flex items-center mb-3">
                            <Package className="w-4 h-4 text-orange-500 mr-2" />
                            <h4 className="text-sm font-medium text-gray-900">
                                Low Stock Items ({data.lowStockCount})
                            </h4>
                        </div>
                        <div className="space-y-2">
                            {lowStockProducts.slice(0, 3).map((product) => (
                                <div key={product.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-orange-900">{product.title}</p>
                                            <p className="text-xs text-orange-700">
                                                Reorder Level: {product.reorderLevel}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-orange-900">
                                            {product.quantity} left
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {data.overdueInvoices.length === 0 && data.lowStockCount === 0 && (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <AlertTriangle className="w-6 h-6 text-green-600" />
                        </div>
                        <p className="text-sm text-gray-500">No alerts at this time</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlertsPanel;