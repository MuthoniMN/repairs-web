import React from 'react';
import { DashboardSummary } from '../../types/';
import {
    Package,
    FileText,
    CreditCard,
    Receipt,
    DollarSign,
    TrendingUp,
    TrendingDown
} from 'lucide-react';

interface OverviewCardsProps {
    data: DashboardSummary['overview'];
}

const OverviewCards: React.FC<OverviewCardsProps> = ({ data }) => {
    const cards = [
        {
            title: 'Total Products',
            value: data.totalProducts.toLocaleString(),
            icon: Package,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'Total Invoices',
            value: data.totalInvoices.toLocaleString(),
            icon: FileText,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Total Payments',
            value: data.totalPayments.toLocaleString(),
            icon: CreditCard,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        },
        {
            title: 'Total Expenses',
            value: data.totalExpenses.toLocaleString(),
            icon: Receipt,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-600'
        },
        {
            title: 'Total Revenue',
            value: `$${data.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: 'bg-emerald-500',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600'
        },
        {
            title: 'Total Expenses',
            value: `$${data.totalExpenseAmount.toLocaleString()}`,
            icon: TrendingDown,
            color: 'bg-red-500',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600'
        },
        {
            title: 'Net Profit',
            value: `$${data.netProfit.toLocaleString()}`,
            icon: TrendingUp,
            color: 'bg-indigo-500',
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-7 gap-6 mb-8">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200 min-w-[200px]"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            </div>
                            <div className={`${card.bgColor} p-3 rounded-lg`}>
                                <Icon className={`w-6 h-6 ${card.textColor}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OverviewCards;