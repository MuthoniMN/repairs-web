"use client"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
    data: {
        daily: number;
        weekly: number;
        monthly: number;
    };
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
    const chartData = [
        { name: 'Daily', revenue: data.daily, expenses: data.daily * 0.3 },
        { name: 'Weekly', revenue: data.weekly, expenses: data.weekly * 0.28 },
        { name: 'Monthly', revenue: data.monthly, expenses: data.monthly * 0.27 }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue vs Expenses</h3>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Revenue</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">Expenses</span>
                    </div>
                </div>
            </div>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            stroke="#6b7280"
                            fontSize={12}
                        />
                        <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickFormatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Tooltip
                            formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                            labelStyle={{ color: '#374151' }}
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stackId="1"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                        />
                        <Area
                            type="monotone"
                            dataKey="expenses"
                            stackId="2"
                            stroke="#ef4444"
                            fill="#ef4444"
                            fillOpacity={0.6}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RevenueChart;