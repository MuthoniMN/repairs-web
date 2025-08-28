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

// Default data structure matching exact DashboardSummary type
const defaultDashboardData: DashboardSummary = {
    overview: {
        totalProducts: 0,
        totalInvoices: 0,
        totalPayments: 0,
        totalExpenses: 0,
        totalRevenue: 0,
        totalExpenseAmount: 0,
        netProfit: 0,
    },
    inventory: {
        lowStockCount: 0,
        totalStockValue: 0,
        lowStockProducts: [],
    },
    financials: {
        revenue: {
            total: 0,
            daily: 0,
            weekly: 0,
            monthly: 0,
            average: 0,
        },
        expenses: {
            total: 0,
            daily: 0,
            weekly: 0,
            monthly: 0,
            average: 0,
            supplierTotal: 0,
            contractorTotal: 0,
        },
        paymentMethods: {},
        expenseTypes: {},
    },
    alerts: {
        overdueInvoices: [],
        lowStockCount: 0,
    },
    recentActivity: {
        payments: [],
        expenses: [],
    },
    analytics: {
        salesByProduct: {},
        invoicesByStatus: {},
        paymentsByMethod: {},
        expensesByType: {},
    },
};

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardSummary>(defaultDashboardData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const res = await getDashboardData(accessToken);

                if (res.success && res.data) {
                    // Deep merge with defaults to ensure all properties exist
                    const validatedData: DashboardSummary = {
                        overview: {
                            totalProducts: res.data.overview?.totalProducts ?? 0,
                            totalInvoices: res.data.overview?.totalInvoices ?? 0,
                            totalPayments: res.data.overview?.totalPayments ?? 0,
                            totalExpenses: res.data.overview?.totalExpenses ?? 0,
                            totalRevenue: res.data.overview?.totalRevenue ?? 0,
                            totalExpenseAmount: res.data.overview?.totalExpenseAmount ?? 0,
                            netProfit: res.data.overview?.netProfit ?? 0,
                        },
                        inventory: {
                            lowStockCount: res.data.inventory?.lowStockCount ?? 0,
                            totalStockValue: res.data.inventory?.totalStockValue ?? 0,
                            lowStockProducts: Array.isArray(res.data.inventory?.lowStockProducts)
                                ? res.data.inventory.lowStockProducts
                                : [],
                        },
                        financials: {
                            revenue: {
                                total: res.data.financials?.revenue?.total ?? 0,
                                daily: res.data.financials?.revenue?.daily ?? 0,
                                weekly: res.data.financials?.revenue?.weekly ?? 0,
                                monthly: res.data.financials?.revenue?.monthly ?? 0,
                                average: res.data.financials?.revenue?.average ?? 0,
                            },
                            expenses: {
                                total: res.data.financials?.expenses?.total ?? 0,
                                daily: res.data.financials?.expenses?.daily ?? 0,
                                weekly: res.data.financials?.expenses?.weekly ?? 0,
                                monthly: res.data.financials?.expenses?.monthly ?? 0,
                                average: res.data.financials?.expenses?.average ?? 0,
                                supplierTotal: res.data.financials?.expenses?.supplierTotal ?? 0,
                                contractorTotal: res.data.financials?.expenses?.contractorTotal ?? 0,
                            },
                            paymentMethods: res.data.financials?.paymentMethods ?? {},
                            expenseTypes: res.data.financials?.expenseTypes ?? {},
                        },
                        alerts: {
                            overdueInvoices: Array.isArray(res.data.alerts?.overdueInvoices)
                                ? res.data.alerts.overdueInvoices
                                : [],
                            lowStockCount: res.data.alerts?.lowStockCount ?? 0,
                        },
                        recentActivity: {
                            payments: Array.isArray(res.data.recentActivity?.payments)
                                ? res.data.recentActivity.payments
                                : [],
                            expenses: Array.isArray(res.data.recentActivity?.expenses)
                                ? res.data.recentActivity.expenses
                                : [],
                        },
                        analytics: {
                            salesByProduct: res.data.analytics?.salesByProduct ?? {},
                            invoicesByStatus: res.data.analytics?.invoicesByStatus ?? {},
                            paymentsByMethod: res.data.analytics?.paymentsByMethod ?? {},
                            expensesByType: res.data.analytics?.expensesByType ?? {},
                        },
                    };

                    setData(validatedData);
                } else {
                    console.error('Dashboard API returned unsuccessful response:', res);
                    setError('Failed to load dashboard data');
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [accessToken]);

    // Show loading state
    if (loading) {
        return <Loading />;
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Dashboard Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    // Safe property access with fallbacks
    const todayRevenue = data.financials?.revenue?.daily || 0;
    const revenueData = data.financials?.revenue || { daily: 0, weekly: 0, monthly: 0 };
    const paymentMethods = data.financials?.paymentMethods || [];
    const salesByProduct = data.analytics?.salesByProduct || [];
    const expenseTypes = data.financials?.expenseTypes || [];
    const alerts = data.alerts || [];
    const recentActivity = data.recentActivity || [];
    const inventory = data.inventory || { lowStockProducts: [] };
    const lowStockProducts = inventory.lowStockProducts || [];

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
                                <p className="text-sm text-gray-500">Today's Revenue</p>
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
                <OverviewCards data={data.overview || {}} />

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