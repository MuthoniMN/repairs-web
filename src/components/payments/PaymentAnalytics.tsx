"use client"

import React, { useState, useMemo, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
    ColumnFiltersState,
    PaginationState,
} from '@tanstack/react-table';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import {
    DollarSign,
    CreditCard,
    TrendingUp,
    Calendar,
    FileText,
    Smartphone,
    Banknote,
    Building2,
    ChevronUp,
    ChevronDown,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Hash,
    Clock,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { IPayment } from '@/src/types';
import { getPaymentStats, getPaymentSummary, getRecentPayments } from '@/src/actions/payment';
import Loading from '@/app/loading';
import useAuthStore from '@/src/stores/authStore';

interface IPaymentAnalytics {
    totalPayments: number,
    totalAmount: number,
    byMethod: Record<string, string>,
    dailyTotal: number;
    weeklyTotal: number;
    monthlyTotal: number;
    averagePayment: number;
}

interface IMethodData {
    method: 'cash' | 'mpesa' | 'bank-transfer',
    count: string,
    amount: number
}

interface IDailyData {
    date: string,
    cumulative: number,
    amount: number
}

// Colors for charts
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const columnHelper = createColumnHelper<IPayment>();

const PaymentsDashboard = () => {
    const [payments, setPayments] = useState<IPayment[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    });
    const [analytics, setAnalytics] = useState<IPaymentAnalytics>({} as IPaymentAnalytics);
    const [methodData, setMethodData] = useState<IMethodData[]>([]);
    const [dailyData, setDailyData] = useState<IDailyData[]>([]);
    const [loading, setLoading] = useState(true);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getRecentPayments(10, accessToken);
                const stats = await getPaymentStats(accessToken);
                const summ = await getPaymentSummary(accessToken);

                console.log(res, stats, summ);

                if (res.success) {
                    setPayments(res.data);
                }
                if (stats.success && summ.success) {
                    setAnalytics({
                        ...analytics,
                        ...stats.data,
                        ...summ.data
                    });
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [accessToken, analytics])

    // Prepare chart data
    useEffect(() => {
        if (analytics.byMethod) {
            const methods = Object.entries(analytics.byMethod).map(([method, count]) => ({
                method: method.charAt(0).toUpperCase() + method.slice(1).replace('-', ' '),
                count,
                amount: payments.filter(p => p.method === method).reduce((sum, p) => sum + p.amount, 0)
            }));
            setMethodData(methods as IMethodData[])
        }

        if (payments) {
            const data = payments.slice(0, 7).map((payment, index) => ({
                date: new Date(payment.created_at!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                amount: payment.amount,
                cumulative: payments.slice(0, index + 1).reduce((sum, p) => sum + p.amount, 0)
            })).reverse();
            setDailyData(data);
        }
    }, [payments, analytics])

    // Table columns
    const columns = useMemo(() => [
        columnHelper.accessor('ref', {
            header: 'Reference',
            cell: (info) => (
                <div className="flex items-center text-sm">
                    <Hash className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="font-mono text-gray-900">{info.getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('invoice.slug', {
            header: 'Invoice',
            cell: (info) => {
                const invoice = info.row.original.invoice;
                return invoice ? (
                    <div className="flex items-center text-sm">
                        <FileText className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-gray-700">{invoice.slug}</span>
                    </div>
                ) : null;
            },
        }),
        columnHelper.accessor('invoice.job.client.name', {
            header: 'Customer',
            cell: (info) => (
                <div className="font-medium text-gray-900">
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor('amount', {
            header: 'Amount',
            cell: (info) => (
                <div className="flex items-center text-sm font-semibold text-green-600">
                    <p className='font-bold text-lg'>KES</p>
                    {info.getValue().toLocaleString()}
                </div>
            ),
        }),
        columnHelper.accessor('method', {
            header: 'Method',
            cell: (info) => {
                const method = info.getValue();
                const getMethodIcon = () => {
                    switch (method) {
                        case 'mpesa': return <Smartphone className="w-4 h-4" />;
                        case 'cash': return <Banknote className="w-4 h-4" />;
                        case 'bank-transfer': return <Building2 className="w-4 h-4" />;
                        default: return <CreditCard className="w-4 h-4" />;
                    }
                };

                const getMethodColor = () => {
                    switch (method) {
                        case 'mpesa': return 'bg-green-100 text-green-800 border-green-200';
                        case 'cash': return 'bg-blue-100 text-blue-800 border-blue-200';
                        case 'bank-transfer': return 'bg-purple-100 text-purple-800 border-purple-200';
                        default: return 'bg-gray-100 text-gray-800 border-gray-200';
                    }
                };

                return (
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMethodColor()}`}>
                        {getMethodIcon()}
                        <span className="ml-1">{method.charAt(0).toUpperCase() + method.slice(1).replace('-', ' ')}</span>
                    </div>
                );
            },
        }),
        columnHelper.accessor('created_at', {
            header: 'Date',
            cell: (info) => {
                const date = info.getValue();
                return date ? (
                    <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        {new Date(date).toLocaleDateString()} {new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                ) : null;
            },
        }),
    ], []);

    const table = useReactTable({
        data: payments,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: false,
    });

    return (
        <>
            {loading ? (<Loading />) : (<div className="min-h-screen p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments Dashboard</h1>
                        <p className="text-gray-600">Monitor payment analytics and recent transactions</p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Payments</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.totalPayments}</p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600 font-medium">+12% from last month</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                                    <p className="text-2xl font-bold text-gray-900">KES {analytics.totalAmount ? analytics.totalAmount.toLocaleString() : '0'}</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600 font-medium">+8% from last month</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Average Payment</p>
                                    <p className="text-2xl font-bold text-gray-900">KES {analytics.averagePayment || '0'}</p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                                <span className="text-sm text-red-600 font-medium">-3% from last month</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Today&apos;s Total</p>
                                    <p className="text-2xl font-bold text-gray-900">KES {analytics.dailyTotal ? analytics.dailyTotal.toLocaleString() : '0'}</p>
                                </div>
                                <div className="p-3 bg-orange-50 rounded-lg">
                                    <Calendar className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-600 font-medium">+15% from yesterday</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Payment Methods Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                            <div className="flex items-center justify-between">
                                <div className="w-1/2">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={methodData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="count"
                                            >
                                                {methodData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} payments`, 'Count']} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-1/2 pl-4">
                                    {methodData.map((entry, index) => (
                                        <div key={entry.method} className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <div
                                                    className="w-3 h-3 rounded-full mr-2"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="text-sm text-gray-600">{entry.method}</span>
                                            </div>
                                            <span className="text-sm font-medium">{entry.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Payment Trend Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payment Trend</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                                    <YAxis stroke="#6b7280" fontSize={12} />
                                    <Tooltip
                                        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                                        labelStyle={{ color: '#374151' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="#3B82F6"
                                        fill="url(#colorGradient)"
                                        strokeWidth={2}
                                    />
                                    <defs>
                                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Payments Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        value={globalFilter ?? ''}
                                        onChange={(e) => setGlobalFilter(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Search payments..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <th
                                                    key={header.id}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                                        <div className="flex flex-col">
                                                            {header.column.getCanSort() && (
                                                                <div className="flex items-center ml-2">
                                                                    <ChevronUp
                                                                        className={`w-3 h-3 ${header.column.getIsSorted() === 'asc'
                                                                            ? 'text-blue-600'
                                                                            : 'text-gray-300'
                                                                            }`}
                                                                    />
                                                                    <ChevronDown
                                                                        className={`w-3 h-3 ${header.column.getIsSorted() === 'desc'
                                                                            ? 'text-blue-600'
                                                                            : 'text-gray-300'
                                                                            }`}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {table.getRowModel().rows.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50">
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-black">
                            <div className="flex items-center space-x-4">
                                <select
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                                >
                                    {[5, 10, 20].map((pageSize) => (
                                        <option key={pageSize} value={pageSize}>
                                            Show {pageSize}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-sm text-gray-700">
                                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                                    {Math.min(
                                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                        table.getFilteredRowModel().rows.length
                                    )} of {table.getFilteredRowModel().rows.length} payments
                                </span>
                            </div>

                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <ChevronsLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-sm text-gray-700 px-3">
                                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                </span>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                    className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <ChevronsRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
        </>
    );
};

export default PaymentsDashboard;