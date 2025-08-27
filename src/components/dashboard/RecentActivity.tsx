import React from 'react';
import React, { useState } from 'react';
import { DashboardSummary } from '../../types/dashboard';
import { CreditCard, Receipt, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface RecentActivityProps {
    data: DashboardSummary['recentActivity'];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ data }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const allActivity = [
        ...data.payments.map(payment => ({
            ...payment,
            type: 'payment' as const,
            icon: ArrowUpRight,
            color: 'text-green-600',
            bgColor: 'bg-green-100'
        })),
        ...data.expenses.map(expense => ({
            ...expense,
            type: 'expense' as const,
            icon: ArrowDownRight,
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const totalPages = Math.ceil(allActivity.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentActivity = allActivity.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const formatTime = (date: string | Date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <div className="text-sm text-gray-500">
                    {allActivity.length} total activities
                </div>
            </div>

            <div className="space-y-4">
                {currentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                        <div key={`${activity.type}-${activity.id}`} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center">
                                <div className={`${activity.bgColor} p-2 rounded-lg mr-3`}>
                                    <Icon className={`w-4 h-4 ${activity.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 capitalize">
                                        {activity.type} - {activity.method}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatTime(activity.created_at)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-semibold ${activity.color}`}>
                                    {activity.type === 'payment' ? '+' : '-'}${activity.amount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <div className="flex flex-col 2xl:flex-row gap-6 items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        Showing {startIndex + 1}-{Math.min(endIndex, allActivity.length)} of {allActivity.length}
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex items-center space-x-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => goToPage(page)}
                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-150 ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
            {allActivity.length === 0 && (
                <div className="text-center py-8">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No recent activity</p>
                </div>
            )}
        </div>
    );
};

export default RecentActivity;