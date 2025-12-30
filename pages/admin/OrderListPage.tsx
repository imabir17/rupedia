import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { Eye, X } from 'lucide-react';
import Invoice from '../../components/Invoice';

const OrderListPage: React.FC = () => {
    const { orders, updateOrderStatus } = useStore();
    const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

    const handleStatusChange = (id: string, newStatus: Order['status']) => {
        updateOrderStatus(id, newStatus);
    };

    return (
        <div>
            <h2 className="text-3xl font-serif text-slate-800 mb-6">Order Management</h2>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Order ID</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Payment</th>
                                <th className="px-6 py-4 font-semibold">Items</th>
                                <th className="px-6 py-4 font-semibold">Total</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map(order => (
                                <tr
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className="hover:bg-slate-50 transition-colors text-sm cursor-pointer"
                                >
                                    <td className="px-6 py-4 font-mono text-slate-600">#{order.id}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{order.customerName}</div>
                                        <div className="text-xs text-slate-500">{order.customerPhone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-800 font-medium">{order.paymentMethod}</div>
                                        {order.paymentPlatform && (
                                            <div className="text-xs text-slate-500">
                                                {order.paymentPlatform}
                                                {order.trxId && <span className="block font-mono mt-1 bg-slate-100 px-1 rounded w-max">Trx: {order.trxId}</span>}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {order.items.map(item => (
                                            <div key={item.id} className="text-xs">
                                                {item.quantity}x {item.name}
                                                <span className="text-slate-400 ml-1">
                                                    {item.selectedColor && `(${item.selectedColor})`}
                                                    {item.selectedSize && `[${item.selectedSize}]`}
                                                </span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">৳{order.totalAmount}</td>
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                            className={`max-w-[140px] px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-primary ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                        order.status.includes('Refund') ? 'bg-orange-100 text-orange-800' :
                                                            order.status.includes('Return') ? 'bg-rose-100 text-rose-800' :
                                                                'bg-blue-100 text-blue-800'
                                                }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option disabled>──────────</option>
                                            <option value="Return Processing">Return Processing</option>
                                            <option value="Returned">Returned</option>
                                            <option value="Refund Processing">Refund Processing</option>
                                            <option value="Refunded">Refunded</option>
                                            <option value="Exchange Processing">Exchange Processing</option>
                                            <option value="Exchanged">Exchanged</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="p-8 text-center text-slate-400">No orders found.</div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:p-0" onClick={() => setSelectedOrder(null)}>
                    <div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in-up print:fixed print:inset-0 print:max-h-full print:rounded-none print:shadow-none"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center print:hidden">
                            <div>
                                <h3 className="font-serif text-xl text-slate-800">Order Management</h3>
                                <p className="text-sm text-slate-500">Status Update & Invoice</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-900 transition-colors flex items-center gap-2"
                                    onClick={() => window.print()}
                                >
                                    <span className="hidden sm:inline">Print Invoice</span>
                                </button>
                                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Status Control */}
                            <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200 print:hidden">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Update Order Status</label>
                                <select
                                    value={selectedOrder.status}
                                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
                                    className="w-full px-4 py-2 rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option disabled>──────────</option>
                                    <option value="Return Processing">Return Processing</option>
                                    <option value="Returned">Returned</option>
                                    <option value="Refund Processing">Refund Processing</option>
                                    <option value="Refunded">Refunded</option>
                                    <option value="Exchange Processing">Exchange Processing</option>
                                    <option value="Exchanged">Exchanged</option>
                                </select>
                            </div>

                            {/* The Invoice Component */}
                            <Invoice order={selectedOrder} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderListPage;
