import React from 'react';
import { Order } from '../types';

interface InvoiceProps {
    order: Order;
    className?: string;
}

const Invoice: React.FC<InvoiceProps> = ({ order, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden print:shadow-none print:border-0 print:w-full print:absolute print:top-0 print:left-0 ${className}`}>
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
                                        {item.selectedOptions ? (
                                            Object.entries(item.selectedOptions).map(([key, value]) => (
                                                <span key={key} className="mr-2 capitalize">{key}: {value}</span>
                                            ))
                                        ) : (
                                            <>
                                                {item.selectedColor && `Color: ${item.selectedColor} `}
                                                {item.selectedSize && `Size: ${item.selectedSize}`}
                                            </>
                                        )}
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
                    Questions? Contact us at rupediaa@gmail.com or 01308811838.
                </p>
            </div>
        </div>
    );
};

export default Invoice;
