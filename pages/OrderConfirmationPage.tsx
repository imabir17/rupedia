import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { CheckCircle, Printer, ShoppingBag } from 'lucide-react';
import Invoice from '../components/Invoice';

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
                <Invoice order={order} />

            </div>
        </div>
    );
};

export default OrderConfirmationPage;
