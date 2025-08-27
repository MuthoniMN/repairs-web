import React from 'react';
import {
    Package,
    AlertTriangle,
    TrendingUp,
    Eye,
    Edit,
    Trash2,
    Tag,
    Barcode,
    Calendar,
    User,
    Building2,
    ShoppingCart,
    Paperclip
} from 'lucide-react';
import { IProduct } from '@/src/types';

interface ProductCardProps {
    product: IProduct;
    onView?: (product: IProduct) => void;
    onEdit?: (product: IProduct) => void;
    onDelete?: (product: IProduct) => void;
    onReorder?: (product: IProduct) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onView,
    onEdit,
    onDelete,
    onReorder
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const calculateProfit = () => {
        return product.profit ?? (product.sellingPrice - product.unitPrice);
    };

    const getProfitMargin = () => {
        if (product.sellingPrice === 0) return 0;
        return ((calculateProfit() / product.sellingPrice) * 100);
    };

    const getStockStatus = () => {
        if (product.quantity === 0) {
            return {
                status: 'out-of-stock',
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: <AlertTriangle className="h-4 w-4" />,
                label: 'Out of Stock'
            };
        } else if (product.quantity <= product.reorderLevel) {
            return {
                status: 'low-stock',
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: <AlertTriangle className="h-4 w-4" />,
                label: 'Low Stock'
            };
        } else {
            return {
                status: 'in-stock',
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: <Package className="h-4 w-4" />,
                label: 'In Stock'
            };
        }
    };

    const stockStatus = getStockStatus();
    const profitMargin = getProfitMargin();

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {product.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {product.description}
                            </p>
                            <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500 w-full">
                                <div className="flex items-center w-2/5">
                                    <Barcode className="h-3 w-3 mr-1" />
                                    <span className="font-mono">{product.sku}</span>
                                </div>
                                <div className="flex items-center">
                                    <Tag className="h-3 w-3 mr-1" />
                                    <span>{product.category}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stock Status Badge */}
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${stockStatus.color} ml-3`}>
                        {stockStatus.icon}
                        <span className="ml-1">{stockStatus.label}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Pricing Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Unit Price</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(product.unitPrice)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Selling Price</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatCurrency(product.sellingPrice)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Profit</p>
                            <p className={`text-sm font-semibold ${calculateProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(calculateProfit())}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">Margin</p>
                            <div className="flex items-center">
                                <TrendingUp className={`h-3 w-3 mr-1 ${profitMargin >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                                <p className={`text-sm font-semibold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {profitMargin.toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory Information */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Current Stock</span>
                            <span className={`text-sm font-semibold ${product.quantity <= product.reorderLevel ? 'text-red-600' : 'text-gray-900'}`}>
                                {product.quantity} units
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Reorder Level</span>
                            <span className="text-sm text-gray-900">
                                {product.reorderLevel} units
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Brand</span>
                            <span className="text-sm font-medium text-gray-900">
                                {product.brand}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Reorder Qty</span>
                            <span className="text-sm text-gray-900">
                                {product.reorderQuantity} units
                            </span>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-2">
                    {product.supplier && product.supplier.length > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                                <Building2 className="h-4 w-4 mr-2" />
                                <span>Suppliers</span>
                            </div>
                            <span className="text-sm text-gray-900">
                                {product.supplier.length} supplier{product.supplier.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}

                    {product.attachments && product.attachments.length > 0 && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                                <Paperclip className="h-4 w-4 mr-2" />
                                <span>Attachments</span>
                            </div>
                            <span className="text-sm text-gray-900">
                                {product.attachments.length} file{product.attachments.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}

                    {product.added_by && (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                                <User className="h-4 w-4 mr-2" />
                                <span>Added by</span>
                            </div>
                            <span className="text-sm text-gray-900">
                                {product.added_by.name}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Created</span>
                        </div>
                        <span className="text-sm text-gray-900">
                            {formatDate(product.created_at)}
                        </span>
                    </div>
                </div>

                {/* Low Stock Warning */}
                {product.quantity <= product.reorderLevel && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                            <div className="flex-1">
                                <p className="text-sm text-yellow-800 font-medium">
                                    {product.quantity === 0 ? 'Out of Stock' : 'Low Stock Alert'}
                                </p>
                                <p className="text-xs text-yellow-700 mt-1">
                                    Consider reordering {product.reorderQuantity} units
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                    {onView && (
                        <button
                            onClick={() => onView(product)}
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                        </button>
                    )}

                    {onEdit && (
                        <button
                            onClick={() => onEdit(product)}
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                        </button>
                    )}

                    {onReorder && product.quantity <= product.reorderLevel && (
                        <button
                            onClick={() => onReorder(product)}
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Reorder
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={() => onDelete(product)}
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                        >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;