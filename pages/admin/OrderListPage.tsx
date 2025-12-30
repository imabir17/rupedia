import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { Eye, X } from 'lucide-react';

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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up" onClick={e => e.stopPropagation()}>
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-serif text-xl text-slate-800">Order Details</h3>
                                <p className="text-sm text-slate-500 font-mono">#{selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Customer Info */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Customer</h4>
                                    <div className="space-y-1">
                                        <p className="font-medium text-slate-900">{selectedOrder.customerName}</p>
                                        <p className="text-sm text-slate-600">{selectedOrder.customerPhone}</p>
                                        <p className="text-sm text-slate-600 mt-2">{selectedOrder.customerAddress}</p>
                                        <p className="text-xs text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded mt-1">{selectedOrder.city}</p>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Payment Info</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600">Method:</span>
                                            <span className="text-sm font-medium text-slate-900">{selectedOrder.paymentMethod}</span>
                                        </div>
                                        {selectedOrder.paymentPlatform && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-slate-600">Platform:</span>
                                                <span className="text-sm font-medium text-slate-900">{selectedOrder.paymentPlatform}</span>
                                            </div>
                                        )}
                                        {selectedOrder.trxId && (
                                            <div className="bg-slate-50 p-3 rounded border border-slate-200">
                                                <span className="text-xs text-slate-500 block mb-1">Transaction ID</span>
                                                <code className="text-sm font-mono text-primary">{selectedOrder.trxId}</code>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-sm text-slate-600">Status:</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${selectedOrder.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                    selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>{selectedOrder.status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Order Items</h4>
                                <div className="border rounded-lg overflow-hidden mb-6">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-medium text-slate-600">Product</th>
                                                <th className="px-4 py-2 text-right font-medium text-slate-600">Qty</th>
                                                <th className="px-4 py-2 text-right font-medium text-slate-600">Price</th>
                                                <th className="px-4 py-2 text-right font-medium text-slate-600">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {selectedOrder.items.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-slate-900">{item.name}</div>
                                                        <div className="text-xs text-slate-500">
                                                            {item.category}
                                                            {item.selectedColor && <span className="ml-1 border-l border-slate-300 pl-1">Color: {item.selectedColor}</span>}
                                                            {item.selectedSize && <span className="ml-1 border-l border-slate-300 pl-1">Size: {item.selectedSize}</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-slate-600">x{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right text-slate-600">৳{item.price}</td>
                                                    <td className="px-4 py-3 text-right font-medium text-slate-900">৳{item.price * item.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-slate-50">
                                            <tr>
                                                <td colSpan={3} className="px-4 py-2 text-right text-slate-600">Subtotal</td>
                                                <td className="px-4 py-2 text-right font-medium text-slate-900">৳{selectedOrder.totalAmount - selectedOrder.deliveryFee}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan={3} className="px-4 py-2 text-right text-slate-600">Delivery Fee</td>
                                                <td className="px-4 py-2 text-right font-medium text-slate-900">৳{selectedOrder.deliveryFee}</td>
                                            </tr>
                                            <tr className="border-t border-slate-200">
                                                <td colSpan={3} className="px-4 py-3 text-right font-bold text-slate-800">Grand Total</td>
                                                <td className="px-4 py-3 text-right font-bold text-primary text-lg">৳{selectedOrder.totalAmount}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="px-4 py-2 border border-slate-300 rounded text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-900 transition-colors"
                                    onClick={() => {
                                        window.print();
                                    }}
                                >
                                    Print Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderListPage;
