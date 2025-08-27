"use client"

import React, { useEffect, useState } from 'react';
import OverviewCards from '@/src/components/dashboard/OverviewCards';
import RevenueChart from '@/src/components/dashboard/RevenueChart';
import PaymentMethodsChart from '@/src/components/dashboard/PaymentMethodsChart';
import SalesChart from '@/src/components/dashboard/SalesChart';
import AlertsPanel from '@/src/components/dashboard/AlertPanel';
import RecentActivity from '@/src/components/dashboard/RecentActivity';
import InventoryStatus from '@/src/components/dashboard/InventoryStatus';
import ExpenseBreakdown from '@/src/components/dashboard/ExpenseBreakdown';
import { BarChart3, TrendingUp } from 'lucide-react';
import { getDashboardData } from '@/src/actions/dashboard';
import { DashboardSummary } from '@/src/types';
import Loading from '@/app/loading';
import useAuthStore from '@/src/stores/authStore';

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardSummary | null>();
    const [loading, setLoading] = useState(false);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDashboardData(accessToken);

                if (res.success && res.data) {
                    setData(res.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [accessToken]);

    if (!data || loading) {
        return (<Loading />)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center">
                            <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Welcome back! Here&apos;s what&apos;s happening with your business today.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Today&pos;s Revenue</p>
                                <p className="text-lg font-semibold text-green-600">
                                    ${data.financials.revenue.daily}
                                </p>
                            </div>
                            <div className="bg-green-100 p-2 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Overview Cards */}
                <OverviewCards data={data.overview} />

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <RevenueChart data={data.financials.revenue} />
                    <PaymentMethodsChart data={data.financials.paymentMethods} />
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <SalesChart data={data.analytics.salesByProduct} />
                    <ExpenseBreakdown data={data.financials.expenseTypes} />
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <AlertsPanel
                        data={data.alerts}
                        lowStockProducts={data.inventory.lowStockProducts}
                    />
                    <RecentActivity data={data.recentActivity} />
                    <InventoryStatus data={data.inventory} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;