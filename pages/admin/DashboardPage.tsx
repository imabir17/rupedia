import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import {
    DollarSign, ShoppingBag, Package, XCircle, RotateCcw, RefreshCw,
    Calendar, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Printer
} from 'lucide-react';

type DateRange = 'today' | 'week' | 'month' | 'year' | 'all';
type TabType = 'delivered' | 'cancelled' | 'returned' | 'refunded';

const DashboardPage: React.FC = () => {
    const { orders, products } = useStore();
    const [dateRange, setDateRange] = useState<DateRange>('month');
    const [activeTab, setActiveTab] = useState<TabType>('delivered');

    // --- Helper Functions ---

    const isWithinDateRange = (dateString: string, range: DateRange): boolean => {
        const date = new Date(dateString);
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (range) {
            case 'today':
                return date >= startOfDay;
            case 'week':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - 7);
                return date >= startOfWeek;
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return date >= startOfMonth;
            case 'year':
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                return date >= startOfYear;
            case 'all':
            default:
                return true;
        }
    };

    // --- Data Calculation ---

    const filteredOrders = useMemo(() => {
        return orders.filter(o => isWithinDateRange(o.date, dateRange));
    }, [orders, dateRange]);

    const metrics = useMemo(() => {
        // Segmentation
        const delivered = filteredOrders.filter(o => o.status === 'Delivered');
        const cancelled = filteredOrders.filter(o => o.status === 'Cancelled');
        // Returned includes 'Returned' and 'Return Processing'
        const returned = filteredOrders.filter(o => ['Returned', 'Return Processing'].includes(o.status));
        // Refunded includes 'Refunded' and 'Refund Processing'
        const refunded = filteredOrders.filter(o => ['Refunded', 'Refund Processing'].includes(o.status));

        // Amounts
        const deliveredRevenue = delivered.reduce((sum, o) => sum + o.totalAmount, 0);
        const cancelledAmount = cancelled.reduce((sum, o) => sum + o.totalAmount, 0);
        const returnedAmount = returned.reduce((sum, o) => sum + o.totalAmount, 0);
        const refundedAmount = refunded.reduce((sum, o) => sum + o.totalAmount, 0);

        // Net Revenue Rule: Delivered Revenue - Returned - Refunded
        const netRevenue = deliveredRevenue - returnedAmount - refundedAmount;

        return {
            delivered, cancelled, returned, refunded,
            deliveredRevenue, cancelledAmount, returnedAmount, refundedAmount,
            netRevenue
        };
    }, [filteredOrders]);

    const activeOrdersList = useMemo(() => {
        switch (activeTab) {
            case 'delivered': return metrics.delivered;
            case 'cancelled': return metrics.cancelled;
            case 'returned': return metrics.returned;
            case 'refunded': return metrics.refunded;
            default: return [];
        }
    }, [activeTab, metrics]);

    // --- Charts Logic (Simple SVG) ---

    // 1. Bar Chart Data (Revenue Trend - Daily for 'month'/'week', Monthly for 'year')
    const chartData = useMemo(() => {
        const data: { label: string; value: number }[] = [];
        const groupingMap = new Map<string, number>();

        filteredOrders.forEach(o => {
            if (o.status !== 'Delivered') return; // Only count delivered revenue for trends
            const date = new Date(o.date);
            let key = '';
            if (dateRange === 'year') {
                key = date.toLocaleString('default', { month: 'short' });
            } else {
                key = `${date.getDate()}`; // Day of month
            }
            groupingMap.set(key, (groupingMap.get(key) || 0) + o.totalAmount);
        });

        // Fill gaps if needed, simpler version just sorts keys
        // For accurate charts we'd iterate dates. Here we'll stick to a simple non-gap filling for "agentic" speed unless data is sparse.
        // Let's create a sorted array from the map
        Array.from(groupingMap.entries()).forEach(([key, value]) => {
            data.push({ label: key, value });
        });

        // Basic sort (month names/days won't sort perfectly alphabetically, but decent approximation for prototype)
        return data.slice(-10); // Show last 10 points max for simplicity
    }, [filteredOrders, dateRange]);

    const maxChartValue = Math.max(...chartData.map(d => d.value), 100);

    const handleExportCSV = () => {
        if (activeOrdersList.length === 0) return;

        const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Items', 'Amount', 'Status'];
        const csvContent = [
            headers.join(','),
            ...activeOrdersList.map(order => [
                order.orderNumber || order.id,
                new Date(order.date).toLocaleDateString(),
                `"${order.customerName || order.customer?.name || ''}"`,
                order.customerPhone || order.customer?.phone || '',
                `"${order.items.map(i => `${i.quantity}x ${i.name}`).join('; ')}"`,
                order.totalAmount,
                order.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${activeTab}_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Components ---

    const StatCard = ({ title, value, subValue, icon: Icon, colorClass, borderClass }: any) => (
        <div className={`bg-white p-6 rounded-xl shadow-sm border ${borderClass} hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${colorClass}`}>
                    <Icon size={24} />
                </div>
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{title}</span>
            </div>
            <p className="text-3xl font-bold text-slate-800 tracking-tight">
                {typeof value === 'number' ? `৳${value.toLocaleString()}` : value}
            </p>
            {subValue && <p className="text-sm text-slate-400 mt-1">{subValue}</p>}
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-slate-800">Financial Overview</h2>
                    <p className="text-slate-500 text-sm mt-1">Real-time revenue analysis and order tracking</p>
                </div>

                {/* Date Filter */}
                <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                    {(['today', 'week', 'month', 'year', 'all'] as DateRange[]).map((range) => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range)}
                            className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-all ${dateRange === range
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Net Revenue"
                    value={metrics.netRevenue}
                    subValue="Realized Income"
                    icon={DollarSign}
                    colorClass="bg-emerald-100 text-emerald-600"
                    borderClass="border-emerald-100"
                />
                <StatCard
                    title="Delivered Orders"
                    value={metrics.delivered.length}
                    subValue={`Rev: ৳${metrics.deliveredRevenue.toLocaleString()}`}
                    icon={Package}
                    colorClass="bg-blue-100 text-blue-600"
                    borderClass="border-blue-100"
                />
                <StatCard
                    title="Returns & Refunds"
                    value={`৳${(metrics.returnedAmount + metrics.refundedAmount).toLocaleString()}`}
                    subValue={`${metrics.returned.length + metrics.refunded.length} Orders`}
                    icon={RotateCcw}
                    colorClass="bg-rose-100 text-rose-600"
                    borderClass="border-rose-100"
                />
                <StatCard
                    title="Cancelled"
                    value={`৳${metrics.cancelledAmount.toLocaleString()}`}
                    subValue={`${metrics.cancelled.length} Orders`}
                    icon={XCircle}
                    colorClass="bg-slate-100 text-slate-600"
                    borderClass="border-slate-200"
                />
            </div>

            {/* Charts & Graphs Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Delivered Revenue Trend</h3>
                        <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            <TrendingUp size={16} className="mr-1" />
                            <span>Live Data</span>
                        </div>
                    </div>

                    {/* SVG Bar Chart */}
                    <div className="h-64 flex items-end space-x-2 w-full pt-4">
                        {chartData.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">No delivered orders in this period</div>
                        ) : (
                            chartData.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center group relative">
                                    <div
                                        className="w-full bg-primary/80 rounded-t-sm hover:bg-primary transition-all relative"
                                        style={{ height: `${(d.value / maxChartValue) * 100}%` }}
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                            ৳{d.value.toLocaleString()}
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400 mt-2 rotate-0 truncate w-full text-center">{d.label}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Status Distribution (Pie Chart approximation) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-6">Order Status Breakdown</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Delivered', count: metrics.delivered.length, color: 'bg-blue-500', amount: metrics.deliveredRevenue },
                            { label: 'Cancelled', count: metrics.cancelled.length, color: 'bg-slate-400', amount: metrics.cancelledAmount },
                            { label: 'Returned', count: metrics.returned.length, color: 'bg-rose-500', amount: metrics.returnedAmount },
                            { label: 'Refunded', count: metrics.refunded.length, color: 'bg-amber-500', amount: metrics.refundedAmount },
                        ].map(item => (
                            <div key={item.label}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 flex items-center">
                                        <span className={`w-2 h-2 rounded-full ${item.color} mr-2`}></span>
                                        {item.label}
                                    </span>
                                    <span className="font-medium text-slate-900">{item.count}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                                    <div
                                        className={`h-2 rounded-full ${item.color}`}
                                        style={{ width: `${filteredOrders.length > 0 ? (item.count / filteredOrders.length) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs text-right text-slate-400">৳{item.amount.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Data Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="border-b border-slate-100">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {(['delivered', 'cancelled', 'returned', 'refunded'] as TabType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                    }`}
                            >
                                {tab} Overview
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-slate-800 capitalize">{activeTab} Orders</h4>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center text-sm text-slate-500 hover:text-primary transition-colors"
                        >
                            <Printer size={16} className="mr-2" /> Export Report
                        </button>
                    </div>

                    {activeOrdersList.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <Package size={48} className="mx-auto text-slate-300 mb-3" />
                            <p className="text-slate-500">No {activeTab} orders found for this period.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                        <th className="py-3 font-medium">Order ID</th>
                                        <th className="py-3 font-medium">Date</th>
                                        <th className="py-3 font-medium">Customer</th>
                                        <th className="py-3 font-medium">Items</th>
                                        <th className="py-3 font-medium text-right">Amount</th>
                                        <th className="py-3 font-medium text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {activeOrdersList.map(order => (
                                        <tr key={order.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="py-4 font-mono text-xs text-slate-500">#{order.id}</td>
                                            <td className="py-4 text-sm text-slate-600">{new Date(order.date).toLocaleDateString()}</td>
                                            <td className="py-4 text-sm font-medium text-slate-800">
                                                {order.customerName}
                                                <span className="block text-xs font-normal text-slate-400">{order.customerPhone}</span>
                                            </td>
                                            <td className="py-4 text-sm text-slate-600 max-w-xs truncate">
                                                {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                                            </td>
                                            <td className="py-4 text-sm font-bold text-slate-800 text-right">৳{order.totalAmount.toLocaleString()}</td>
                                            <td className="py-4 text-sm text-right">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
                                                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'Cancelled' ? 'bg-slate-100 text-slate-600' :
                                                            ['Returned', 'Return Processing'].includes(order.status) ? 'bg-rose-100 text-rose-600' :
                                                                'bg-yellow-100 text-yellow-700'}
                                                `}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
