import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Order, PaymentStatus, FulfillmentStatus } from '../../types';
import {
    ArrowLeft, Printer, Package, Truck, CheckCircle, XCircle,
    CreditCard, Calendar, Mail, Phone, MapPin,
    MoreHorizontal, Send
} from 'lucide-react';
import Invoice from '../../components/Invoice';

const OrderDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { orders, updateOrderStatus } = useStore();

    // Find Order (Robust check against ID or OrderNumber if we had a map)
    const order = useMemo(() => orders.find(o => o.id === id), [orders, id]);

    // Local state for actions (e.g. tracking number input)
    const [trackingInput, setTrackingInput] = useState('');
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

    if (!order) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-serif text-slate-800 mb-4">Order Not Found</h2>
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="text-primary hover:underline"
                >
                    Back to Orders
                </button>
            </div>
        );
    }

    // Handlers
    const handleStatusUpdate = (status: any) => {
        // This maps the string status back to the exact enum needed by Context if strictly typed
        updateOrderStatus(order.id, status);
    };

    const getProgressionStep = () => {
        const status = order.fulfillmentStatus || 'unfulfilled';
        if (status === 'delivered') return 4;
        if (status === 'shipped') return 3;
        if (status === 'processing') return 2;
        return 1;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-serif font-bold text-slate-900">
                                {order.orderNumber || order.id}
                            </h1>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {order.paymentStatus || 'Pending'}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ml-2 ${order.fulfillmentStatus === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                                order.fulfillmentStatus === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                    order.fulfillmentStatus === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                                        order.fulfillmentStatus === 'processing' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                            'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                {order.fulfillmentStatus || 'Unfulfilled'}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">
                            Placed on {new Date(order.date).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsInvoiceOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm font-medium"
                    >
                        <Printer size={16} />
                        <span>Invoice</span>
                    </button>
                    {order.fulfillmentStatus !== 'processing' && order.fulfillmentStatus !== 'shipped' && order.fulfillmentStatus !== 'delivered' && (
                        <button
                            onClick={() => handleStatusUpdate('Processing')}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm text-sm font-medium"
                        >
                            <span>Mark as Processing</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content (Left 2 cols) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Order Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-800">Order Items</h3>
                            <span className="text-xs text-slate-500">{order.items.length} items</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="p-4 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-100 rounded-md border border-slate-200 overflow-hidden flex-shrink-0">
                                        <img src={item.images?.[0] || item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-slate-900 text-sm">{item.name}</h4>
                                        <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                                            {item.selectedOptions ? (
                                                Object.entries(item.selectedOptions).map(([key, value]) => (
                                                    <div key={key} className="flex items-center gap-1">
                                                        <span className="font-medium text-slate-400 capitalize">{key}:</span>
                                                        <span className="text-slate-600">{value}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <>
                                                    {item.selectedColor && <div>Color: {item.selectedColor}</div>}
                                                    {item.selectedSize && <div>Size: {item.selectedSize}</div>}
                                                </>
                                            )}
                                        </div>
                                        {item.sku && <div className="text-xs text-slate-400 mt-0.5">SKU: {item.sku}</div>}
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-slate-900 text-sm">৳{item.price}</div>
                                        <div className="text-xs text-slate-500">Qty: {item.quantity}</div>
                                        <div className="font-semibold text-slate-900 text-sm mt-1">৳{item.price * item.quantity}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Summary Footer */}
                        <div className="bg-slate-50 p-6 border-t border-slate-200 space-y-2">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Subtotal</span>
                                <span>৳{order.subtotal || order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Shipping</span>
                                <span>৳{order.deliveryFee}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Tax</span>
                                <span>৳{order.tax}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-lg">
                                <span>Total</span>
                                <span>৳{order.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500 mt-1">
                                <span>Paid by Customer</span>
                                <span>৳{order.paidAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-800 mb-6">Order Timeline</h3>
                        <div className="space-y-6 pl-2">
                            {order.timeline?.map((log, index) => (
                                <div key={log.id || index} className="relative pl-8 border-l-2 border-slate-100 last:border-0 pb-2">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 ring-4 ring-white"></div>
                                    <p className="text-sm font-medium text-slate-900">{log.action}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{new Date(log.date).toLocaleString()}</p>
                                    {log.note && <p className="text-sm text-slate-600 mt-1 bg-slate-50 p-2 rounded">{log.note}</p>}
                                </div>
                            ))}
                            {/* Fallback if no timeline yet */}
                            {!order.timeline && (
                                <p className="text-slate-500 italic text-sm">No history available.</p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Sidebar (Right col) */}
                <div className="space-y-6">

                    {/* Customer Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-slate-800">Customer</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 rounded-full text-slate-500"><Mail size={16} /></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{order.customer?.name || order.customerName}</p>
                                    <p className="text-xs text-slate-500">{order.customer?.email || 'No email provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-slate-100 rounded-full text-slate-500"><Phone size={16} /></div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">{order.customer?.phone || order.customerPhone}</p>
                                </div>
                            </div>
                            <div className="border-t border-slate-100 pt-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shipping Address</h4>
                                <div className="flex items-start gap-2 text-sm text-slate-600">
                                    <MapPin size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                                    <p>{order.shippingAddress?.address || order.customerAddress}, {order.shippingAddress?.city || order.city}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleStatusUpdate('Shipped')}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
                            >
                                <Truck size={16} /> Mark as Shipped
                            </button>
                            <button
                                onClick={() => handleStatusUpdate('Delivered')}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors"
                            >
                                <CheckCircle size={16} /> Mark as Delivered
                            </button>
                            <button
                                onClick={() => handleStatusUpdate('Cancelled')}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
                            >
                                <XCircle size={16} /> Cancel Order
                            </button>
                        </div>
                    </div>

                    {/* Notes Card (Placeholder for now) */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="font-semibold text-slate-800 mb-4">Notes</h3>
                        <textarea
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-primary focus:border-primary"
                            placeholder="Add a note about this order..."
                            rows={3}
                        />
                        <button className="mt-2 text-xs font-medium text-primary hover:text-blue-700">Add Note</button>
                    </div>

                </div>
            </div>

            {/* Invoice Modal */}
            {isInvoiceOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm print:p-0" onClick={() => setIsInvoiceOpen(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto print:fixed print:inset-0 print:max-h-full print:rounded-none" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 z-10 bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center print:hidden">
                            <h3 className="font-medium text-slate-800">Print Invoice</h3>
                            <div className="flex gap-2">
                                <button onClick={() => window.print()} className="px-4 py-1.5 bg-slate-900 text-white rounded text-sm">Print</button>
                                <button onClick={() => setIsInvoiceOpen(false)}><XCircle size={20} className="text-slate-400 hover:text-red-500" /></button>
                            </div>
                        </div>
                        <div className="p-6">
                            <Invoice order={order} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetailsPage;
