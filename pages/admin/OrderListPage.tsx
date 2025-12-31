import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, PaymentStatus, FulfillmentStatus } from '../../types';
import { Eye, Search, Filter, Calendar, ChevronDown, CheckCircle, AlertCircle, XCircle, Truck, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderListPage: React.FC = () => {
    const { orders, updateOrderStatus } = useStore();
    const navigate = useNavigate();

    // Local State for Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<FulfillmentStatus | 'all'>('all');
    const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all');

    // Derived State
    const filteredOrders = useMemo(() => {
        return orders
            .filter(order => {
                const matchesSearch =
                    (order.orderNumber?.toLowerCase()?.includes(searchTerm.toLowerCase())) ||
                    (order.id?.toLowerCase()?.includes(searchTerm.toLowerCase())) ||
                    (order.customer?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())) ||
                    (order.customerName?.toLowerCase()?.includes(searchTerm.toLowerCase())); // Fallback for legacy

                const matchesStatus = statusFilter === 'all' || order.fulfillmentStatus === statusFilter;
                const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;

                return matchesSearch && matchesStatus && matchesPayment;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Default Sort: Newest First
    }, [orders, searchTerm, statusFilter, paymentFilter]);

    // Helpers for Badge Colors
    const getPaymentBadge = (status: PaymentStatus) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'partial': return 'bg-blue-100 text-blue-800';
            case 'refunded': return 'bg-gray-100 text-gray-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    const getFulfillmentBadge = (status: FulfillmentStatus) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'processing': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            case 'returned': return 'bg-rose-100 text-rose-800 border-rose-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const isNewOrder = (dateString: string) => {
        const orderDate = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
        return diffInHours < 24;
    };

    const handleExportCSV = () => {
        const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Items', 'Total', 'Payment Status', 'Fulfillment Status'];
        const csvContent = [
            headers.join(','),
            ...filteredOrders.map(order => [
                order.orderNumber || order.id,
                new Date(order.date).toLocaleDateString(),
                `"${order.customer?.name || order.customerName || ''}"`,
                order.customer?.phone || order.customerPhone || '',
                `"${order.items.map(i => `${i.quantity}x ${i.name}`).join('; ')}"`,
                order.totalAmount,
                order.paymentStatus || 'pending',
                order.fulfillmentStatus || 'unfulfilled'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif text-slate-900">Orders</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage and track all customer orders.</p>
                </div>
                <div className="flex space-x-2">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium">
                        <Calendar size={16} />
                        <span>Last 30 Days</span>
                        <ChevronDown size={14} className="ml-1 opacity-50" />
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm text-sm font-medium"
                    >
                        <Filter size={16} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
                    />
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as FulfillmentStatus | 'all')}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-primary focus:border-primary"
                    >
                        <option value="all">All Fulfillment</option>
                        <option value="unfulfilled">Unfulfilled</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="returned">Returned</option>
                    </select>

                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value as PaymentStatus | 'all')}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-primary focus:border-primary"
                    >
                        <option value="all">All Payment</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Order</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Items</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Total</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <tr
                                        key={order.id}
                                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-medium text-primary group-hover:underline">
                                                    {order.orderNumber || order.id}
                                                </span>
                                                {isNewOrder(order.date) && (
                                                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm animate-pulse">
                                                        NEW
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                                            {new Date(order.date).toLocaleDateString()}
                                            <span className="block text-xs text-slate-400">{new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-700 max-w-[200px] truncate" title={order.items.map(i => i.name).join(', ')}>
                                                {order.items.length} items
                                                <span className="text-slate-400 mx-1">•</span>
                                                <span className="text-slate-500 text-xs">{order.items[0]?.name} {order.items.length > 1 && `+${order.items.length - 1} more`}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900">
                                                {order.customer?.name || order.customerName || 'Guest'}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {order.customer?.phone || order.customerPhone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                                            ৳{order.totalAmount?.toLocaleString() ?? 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getFulfillmentBadge(order.fulfillmentStatus || 'unfulfilled')}`}>
                                                    {order.fulfillmentStatus === 'shipped' && <Truck size={10} className="mr-1" />}
                                                    {order.fulfillmentStatus === 'delivered' && <CheckCircle size={10} className="mr-1" />}
                                                    {order.fulfillmentStatus || order.status || 'unfulfilled'}
                                                </span>
                                                <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getPaymentBadge(order.paymentStatus || 'pending')}`}>
                                                    {order.paymentStatus || 'pending'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {(order.fulfillmentStatus === 'unfulfilled' || !order.fulfillmentStatus) && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            updateOrderStatus(order.id, 'Processing');
                                                        }}
                                                        className="text-xs bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-2 py-1 rounded transition-colors"
                                                        title="Mark as Processing"
                                                    >
                                                        Process
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/admin/orders/${order.id}`);
                                                    }}
                                                    className="text-slate-400 hover:text-primary transition-colors p-1"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        <Package size={48} className="mx-auto text-slate-300 mb-3" />
                                        <p>No orders found matching your filters.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderListPage;
