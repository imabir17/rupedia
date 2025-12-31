import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const CancellationRequestPage: React.FC = () => {
    const { orders, addCancellationRequest, cancellationRequests } = useStore();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        orderId: searchParams.get('orderId') || '',
        name: '',
        phone: '',
        address: '',
        transactionId: '',
        reason: 'Changed my mind',
        otherReason: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validate Order Exists
        const order = orders.find(o => o.orderNumber === formData.orderId || o.id === formData.orderId);

        if (!order) {
            showToast('Order not found. Please check the Order ID.', 'error');
            return;
        }

        // 2. Validate Cancellable State
        if (['shipped', 'delivered', 'returned', 'cancelled'].includes(order.fulfillmentStatus?.toLowerCase())) {
            showToast(`Order cannot be cancelled because it is already ${order.fulfillmentStatus}.`, 'error');
            return;
        }

        // 3. Check for existing request
        const existing = cancellationRequests.find(r => r.orderId === order.id);
        if (existing) {
            showToast('A cancellation request already exists for this order.', 'error');
            return;
        }

        // 4. Submit Request
        const finalReason = formData.reason === 'Other' ? formData.otherReason : formData.reason;

        addCancellationRequest({
            orderId: order.id,
            customerName: formData.name,
            phone: formData.phone,
            address: formData.address,
            transactionId: formData.transactionId,
            reason: finalReason
        });

        setIsSubmitted(true);
        window.scrollTo(0, 0);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 pt-20 pb-12 flex items-center justify-center px-4">
                <div className="bg-white max-w-lg w-full rounded-xl p-8 shadow-sm border border-green-100 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-serif text-slate-900 mb-2">Request Submitted</h2>
                    <p className="text-slate-600 mb-6">
                        Your cancellation request for order <span className="font-mono font-bold text-slate-800">{formData.orderId}</span> has been received.
                        Our team will review it shortly. You can check the status on the tracking page.
                    </p>
                    <button onClick={() => navigate('/order-status')} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors">
                        Track Status
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 mb-6 hover:text-primary transition-colors">
                    <ArrowLeft size={18} className="mr-1" /> Back
                </button>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-slate-900 mb-2">Request Order Cancellation</h1>
                    <p className="text-slate-500">Please provide your order details to process the cancellation.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6 flex gap-3">
                        <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
                        <div className="text-sm text-yellow-800">
                            <strong>Note:</strong> Cancellation is only possible pending orders. If your order has already been shipped, you may need to wait for delivery and initiate a return instead.
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Order Number *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.orderId}
                                    onChange={e => setFormData({ ...formData, orderId: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2.5 border"
                                    placeholder="ORD-1001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Transaction ID (TrxID)</label>
                                <input
                                    type="text"
                                    value={formData.transactionId}
                                    onChange={e => setFormData({ ...formData, transactionId: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2.5 border"
                                    placeholder="If paid online"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2.5 border"
                                    placeholder="+880..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                            <textarea
                                required
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2.5 border"
                                rows={2}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Cancellation *</label>
                            <select
                                required
                                value={formData.reason}
                                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2.5 border mb-2"
                            >
                                <option value="Changed my mind">Changed my mind</option>
                                <option value="Found better price">Found better price</option>
                                <option value="Ordered by mistake">Ordered by mistake</option>
                                <option value="Delivery time too long">Delivery time too long</option>
                                <option value="Other">Other</option>
                            </select>

                            {formData.reason === 'Other' && (
                                <textarea
                                    required
                                    placeholder="Please specify..."
                                    value={formData.otherReason}
                                    onChange={e => setFormData({ ...formData, otherReason: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/20 p-2.5 border"
                                    rows={2}
                                />
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-rose-600 text-white py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                        >
                            Request Cancellation
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CancellationRequestPage;
