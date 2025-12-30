import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CheckCircle, Printer, ShoppingBag } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { orders } = useStore();

    const order = orders.find(o => o.id === id);

    const handlePrint = () => {
        window.print();
    };

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <h2 className="text-2xl font-serif text-slate-800 mb-4">Order not found</h2>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
            <div className="max-w-3xl mx-auto print:max-w-none print:w-full">

                <div className="text-center mb-8 animate-fade-in-up print:hidden">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                        <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h1 className="text-3xl font-serif text-slate-900 mb-2">Order Confirmed!</h1>
                    <p className="text-slate-600">Thank you for your purchase. Your order ID is <span className="font-mono font-medium text-slate-800">{order.id}</span>.</p>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 mb-8 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm"
                    >
                        <Printer size={18} />
                        Download PDF
                    </button>
                    <button
                        onClick={() => navigate('/shop')}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors shadow-lg hover:shadow-xl"
                    >
                        <ShoppingBag size={18} />
                        Continue Shopping
                    </button>
                </div>

                {/* Invoice / Order Details Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-0 print:w-full print:absolute print:top-0 print:left-0">
                    {/* Header */}
                    <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-serif text-primary">Rupedia</h2>
                            <p className="text-xs text-slate-500 mt-1">Authentic Traditional Wear & Crafts</p>
                        </div>
                        <div className="text-right">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Invoice</h3>
                            <p className="font-medium text-slate-800 mt-1">#{order.id}</p>
                            <p className="text-xs text-slate-500">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Customer & Shipping Info */}
                        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                            <div>
                                <h4 className="font-medium text-slate-400 uppercase tracking-wider text-xs mb-2">Billed To</h4>
                                <p className="font-semibold text-slate-800 text-lg">{order.customerName}</p>
                                <p className="text-slate-600">{order.customerPhone}</p>
                                <p className="text-slate-600 whitespace-pre-wrap">{order.customerAddress}</p>
                                <p className="text-slate-600 font-medium mt-1">{order.city}</p>
                            </div>
                            <div className="text-right">
                                <h4 className="font-medium text-slate-400 uppercase tracking-wider text-xs mb-2">Payment Info</h4>
                                <p className="text-slate-800"><span className="text-slate-500">Method:</span> {order.paymentMethod}</p>
                                {order.paymentPlatform && (
                                    <p className="text-slate-800"><span className="text-slate-500">Platform:</span> {order.paymentPlatform}</p>
                                )}
                                {order.trxId && (
                                    <p className="text-slate-800"><span className="text-slate-500">TrxID:</span> {order.trxId}</p>
                                )}
                                <div className="mt-4 inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded uppercase tracking-wide border border-green-200">
                                    {order.paymentMethod === 'Online Payment' ? 'Paid' : 'Payment Due'}
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <table className="w-full text-left mb-8">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    <th className="py-3">Item</th>
                                    <th className="py-3 text-center">Qty</th>
                                    <th className="py-3 text-right">Price</th>
                                    <th className="py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {order.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-4">
                                            <p className="font-medium text-slate-800">{item.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {item.selectedColor && `Color: ${item.selectedColor} `}
                                                {item.selectedSize && `Size: ${item.selectedSize}`}
                                            </p>
                                        </td>
                                        <td className="py-4 text-center text-slate-600">{item.quantity}</td>
                                        <td className="py-4 text-right text-slate-600">৳{item.price}</td>
                                        <td className="py-4 text-right font-medium text-slate-800">৳{item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Summary & Totals */}
                        <div className="border-t border-slate-200 pt-6 flex justify-end">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Subtotal</span>
                                    <span>৳{order.totalAmount - order.deliveryFee}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Delivery Fee</span>
                                    <span>৳{order.deliveryFee}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-slate-900 border-t border-slate-200 pt-3 mt-3">
                                    <span>Total</span>
                                    <span>৳{order.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
                        <p className="text-xs text-slate-500">
                            Questions? Contact us at support@rupedia.com or +880123456789.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderConfirmationPage;
