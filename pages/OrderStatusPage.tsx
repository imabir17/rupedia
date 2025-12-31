import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Package, Clock, CheckCircle, XCircle, Truck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderStatusPage: React.FC = () => {
    const { orders, cancellationRequests } = useStore();
    const [orderId, setOrderId] = useState('');
    const [searched, setSearched] = useState(false);
    const [foundOrder, setFoundOrder] = useState<any | null>(null);
    const [relatedCancellation, setRelatedCancellation] = useState<any | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearched(true);
        const order = orders.find(o => o.orderNumber === orderId || o.id === orderId);
        setFoundOrder(order || null);

        if (order) {
            const cancellation = cancellationRequests.find(r => r.orderId === order.id);
            setRelatedCancellation(cancellation || null);
        } else {
            setRelatedCancellation(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
            case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'processing': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return <CheckCircle size={20} />;
            case 'shipped': return <Truck size={20} />;
            case 'processing': return <Clock size={20} />;
            case 'cancelled': return <XCircle size={20} />;
            default: return <Package size={20} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif text-slate-900 mb-4">Track Your Order</h1>
                    <p className="text-slate-500">Enter your Order ID to check the current status and delivery updates.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="e.g. ORD-1001"
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors">
                            Check Status
                        </button>
                    </form>
                </div>

                {searched && !foundOrder && (
                    <div className="bg-white rounded-xl shadow-sm border border-red-100 p-8 text-center animate-fade-in">
                        <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 mb-2">Order Not Found</h3>
                        <p className="text-slate-500">We couldn't find an order with ID "{orderId}". Please check the number and try again.</p>
                    </div>
                )}

                {foundOrder && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justifying-between items-center">
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Order Number</p>
                                <p className="text-lg font-mono font-medium text-slate-900">{foundOrder.orderNumber || foundOrder.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Date Placed</p>
                                <p className="text-sm text-slate-700">{new Date(foundOrder.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex flex-col items-center justify-center py-6 mb-6">
                                <div className={`flex items-center gap-3 px-6 py-3 rounded-full border ${getStatusColor(foundOrder.fulfillmentStatus || 'Pending')}`}>
                                    {getStatusIcon(foundOrder.fulfillmentStatus || 'Pending')}
                                    <span className="font-bold uppercase tracking-wide">{foundOrder.fulfillmentStatus || 'Pending'}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Last Updated: {new Date(foundOrder.date).toLocaleString()}</p>
                            </div>

                            {/* Timeline / Progress Bar could go here */}

                            {relatedCancellation && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                    <h4 className="font-medium text-yellow-800 mb-1 flex items-center gap-2">
                                        <AlertCircle size={16} /> Cancellation Request: {relatedCancellation.status}
                                    </h4>
                                    <p className="text-sm text-yellow-700">
                                        You requested a cancellation for this order on {new Date(relatedCancellation.date).toLocaleDateString()}.
                                        Status: <span className="font-bold uppercase">{relatedCancellation.status}</span>.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h3 className="font-medium text-slate-900 border-b border-slate-100 pb-2">Order Summary</h3>
                                {foundOrder.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-slate-600">{item.quantity}x {item.name}</span>
                                        {/* Hide price for privacy if desired, or show it */}
                                    </div>
                                ))}
                            </div>

                            {!['shipped', 'delivered', 'cancelled', 'returned'].includes(foundOrder.fulfillmentStatus?.toLowerCase()) && !relatedCancellation && (
                                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                    <p className="text-sm text-slate-500 mb-3">Changed your mind?</p>
                                    <Link to={`/cancel-order?orderId=${foundOrder.orderNumber || foundOrder.id}`} className="text-rose-600 hover:text-rose-700 text-sm font-medium underline">
                                        Request Cancellation
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderStatusPage;
