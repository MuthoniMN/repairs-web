import React from 'react';
import {
    FileText,
    Calendar,
    DollarSign,
    CheckCircle,
    Clock,
    AlertCircle,
    Eye,
    Download,
    Send,
    Edit,
    Package,
    Briefcase,
    CreditCard
} from 'lucide-react';

interface ISale {
    id?: string;
    product_name?: string;
    quantity: number;
    price: number;
}

interface IJob {
    id?: string;
    title: string;
    description?: string;
}

interface IJobCard {
    id?: string;
    title: string;
    description?: string;
}

interface IInvoice {
    id?: string;
    products?: ISale[];
    job?: IJob;
    cards?: IJobCard[];
    title: string;
    slug: string;
    issued_on?: string;
    status?: 'pending' | 'partially-paid' | 'settled';
    last_paid_on?: string;
    tax: number;
    total: number;
    created_at?: string;
    updated_at?: string;
}

interface InvoiceCardProps {
    invoice: IInvoice;
    onView?: (invoice: IInvoice) => void;
    onEdit?: (invoice: IInvoice) => void;
    onDownload?: (invoice: IInvoice) => void;
    onSend?: (invoice: IInvoice) => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
    invoice,
    onView,
    onEdit,
    onDownload,
    onSend
}) => {
    const getStatusConfig = (status?: string) => {
        switch (status) {
            case 'settled':
                return {
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: <CheckCircle className="h-4 w-4" />,
                    label: 'Settled'
                };
            case 'partially-paid':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    icon: <Clock className="h-4 w-4" />,
                    label: 'Partially Paid'
                };
            case 'pending':
                return {
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: <AlertCircle className="h-4 w-4" />,
                    label: 'Pending'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <FileText className="h-4 w-4" />,
                    label: 'Unknown'
                };
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not set';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const calculateSubtotal = () => {
        return invoice.total - invoice.tax;
    };

    const statusConfig = getStatusConfig(invoice.status);
    const isOverdue = invoice.status === 'pending' && invoice.issued_on &&
        new Date(invoice.issued_on) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {invoice.title}
                            </h3>
                            <p className="text-sm text-gray-500 font-mono">
                                #{invoice.slug}
                            </p>
                            {invoice.job && (
                                <div className="flex items-center mt-1 text-sm text-gray-600">
                                    <Briefcase className="h-3 w-3 mr-1" />
                                    <span className="truncate">{invoice.job.title}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                        {statusConfig.icon}
                        <span className="ml-1">{statusConfig.label}</span>
                    </div>
                </div>

                {isOverdue && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                            <span className="text-sm text-red-700 font-medium">Overdue</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Amount Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-900 font-medium">
                                {formatCurrency(calculateSubtotal())}
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span className="text-gray-900 font-medium">
                                {formatCurrency(invoice.tax)}
                            </span>
                        </div>

                        <div className="border-t border-gray-200 pt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-base font-semibold text-gray-900">Total</span>
                                <span className="text-lg font-bold text-gray-900">
                                    {formatCurrency(invoice.total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date Information */}
                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Issued</span>
                        </div>
                        <span className="text-gray-900 font-medium">
                            {formatDate(invoice.issued_on)}
                        </span>
                    </div>

                    {invoice.last_paid_on && (
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                                <DollarSign className="h-4 w-4 mr-2" />
                                <span>Last Payment</span>
                            </div>
                            <span className="text-gray-900 font-medium">
                                {formatDate(invoice.last_paid_on)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Items Summary */}
                <div className="space-y-2">
                    {invoice.products && invoice.products.length > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                                <Package className="h-4 w-4 mr-2" />
                                <span>Products</span>
                            </div>
                            <span className="text-gray-900 font-medium">
                                {invoice.products.length} item{invoice.products.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}

                    {invoice.cards && invoice.cards.length > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                                <CreditCard className="h-4 w-4 mr-2" />
                                <span>Job Cards</span>
                            </div>
                            <span className="text-gray-900 font-medium">
                                {invoice.cards.length} card{invoice.cards.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                    {onView && (
                        <button
                            onClick={() => onView(invoice)}
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                        </button>
                    )}

                    {onDownload && (
                        <button
                            onClick={() => onDownload(invoice)}
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                        </button>
                    )}

                    {onSend && invoice.status !== 'settled' && (
                        <button
                            onClick={() => onSend(invoice)}
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <Send className="h-3 w-3 mr-1" />
                            Send
                        </button>
                    )}

                    {onEdit && (
                        <button
                            onClick={() => onEdit(invoice)}
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceCard;