import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { MapPin, CreditCard, Send, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { cart, placeOrder } = useStore();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: 'Inside Dhaka',
        paymentMethod: 'COD',
        paymentPlatform: 'bKash',
        trxId: ''
    });

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = formData.city === 'Inside Dhaka' ? 80 : 130;
    const total = subtotal + deliveryFee;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.paymentMethod !== 'COD' && !formData.trxId) {
            alert('Please provide the Transaction ID for online payment.');
            return;
        }

        // Place order in Global Store
        placeOrder({
            customerName: formData.name,
            customerPhone: formData.phone,
            customerAddress: formData.address,
            city: formData.city,
            items: cart,
            totalAmount: total,
            deliveryFee: deliveryFee,
            paymentMethod: formData.paymentMethod as Order['paymentMethod'],
            paymentPlatform: formData.paymentMethod === 'Online Payment' ? (formData.paymentPlatform as Order['paymentPlatform']) : undefined,
            trxId: formData.trxId || undefined,
        });

        alert(`Order Placed Successfully! \nTotal: ${total} BDT`);
        navigate('/'); // Redirect to Home
        // Ideally we should clear the cart here too, but for now we focus on Admin integration
        window.location.reload(); // Simple hack to clear cart/state for demo
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <h2 className="text-2xl font-serif text-slate-800 mb-4">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/shop')}
                    className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                >
                    Return to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Left Column: Shipping & Payment Details */}
                <div>
                    <h2 className="text-2xl font-serif text-slate-800 mb-6 flex items-center">
                        <MapPin className="mr-2" /> Shipping Details
                    </h2>

                    <form id="checkout-form" onSubmit={handlePlaceOrder} className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-accent focus:border-accent"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-accent focus:border-accent"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Address</label>
                            <textarea
                                name="address"
                                required
                                rows={3}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-accent focus:border-accent"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Location</label>
                            <select
                                name="city"
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-accent focus:border-accent"
                                value={formData.city}
                                onChange={handleInputChange}
                            >
                                <option value="Inside Dhaka">Inside Dhaka (80 BDT)</option>
                                <option value="Outside Dhaka">Outside Dhaka (130 BDT)</option>
                            </select>
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
                                <CreditCard className="mr-2" /> Payment Method
                            </h3>

                            <div className="space-y-4">
                                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition border-slate-200">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={formData.paymentMethod === 'COD'}
                                        onChange={handleInputChange}
                                        className="text-accent focus:ring-accent"
                                    />
                                    <span className="ml-3 font-medium text-slate-700">Cash on Delivery (Advance Delivery Fee)</span>
                                </label>

                                <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition border-slate-200">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Online Payment"
                                        checked={formData.paymentMethod === 'Online Payment'}
                                        onChange={handleInputChange}
                                        className="text-accent focus:ring-accent"
                                    />
                                    <span className="ml-3 font-medium text-slate-700">Full Payment (bKash / Nagad)</span>
                                </label>
                            </div>

                            {/* Payment Instructions */}
                            <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-100">
                                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                                    <Smartphone className="mr-2" size={18} />
                                    Payment Instructions
                                </h4>
                                <div className="text-sm text-blue-800 space-y-2 mb-4">
                                    <p>Send Money to Personal Number:</p>
                                    <p className="font-mono bg-white inline-block px-2 py-1 rounded border border-blue-200">01308811838 (bKash / Nagad)</p>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-blue-900 mb-2">Paid via:</label>
                                    <div className="flex space-x-4">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="paymentPlatform"
                                                value="bKash"
                                                checked={formData.paymentPlatform === 'bKash'}
                                                onChange={handleInputChange}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-blue-800">bKash</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="paymentPlatform"
                                                value="Nagad"
                                                checked={formData.paymentPlatform === 'Nagad'}
                                                onChange={handleInputChange}
                                                className="text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-blue-800">Nagad</span>
                                        </label>
                                    </div>
                                </div>

                                <p className="text-xs text-blue-700 mb-4">
                                    {formData.paymentMethod === 'COD'
                                        ? `* To confirm your order, please advance the DELIVERY FEE of ${deliveryFee} BDT.`
                                        : `* Please pay the TOTAL amount of ${total} BDT.`}
                                </p>

                                <div>
                                    <label className="block text-sm font-medium text-blue-900 mb-1">Transaction ID (TrxID)</label>
                                    <input
                                        type="text"
                                        name="trxId"
                                        required
                                        placeholder="e.g., 8N7A6D5..."
                                        className="w-full px-4 py-2 border border-blue-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        value={formData.trxId}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                        </div>

                    </form>
                </div>

                {/* Right Column: Order Summary */}
                <div>
                    <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-100 sticky top-24">
                        <h2 className="text-xl font-serif text-slate-800 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.cartItemId} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden mr-3">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-800 line-clamp-1">{item.name}</h4>
                                            <p className="text-xs text-slate-500">
                                                Qty: {item.quantity}
                                                {item.selectedColor && ` | ${item.selectedColor}`}
                                                {item.selectedSize && ` | ${item.selectedSize}`}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">{item.price * item.quantity} BDT</p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>{subtotal} BDT</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Delivery Fee</span>
                                <span>{deliveryFee} BDT</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-primary pt-3 border-t border-slate-100">
                                <span>Total</span>
                                <span>{total} BDT</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="w-full mt-8 bg-black text-white py-4 rounded-md font-medium hover:bg-slate-800 transition flex items-center justify-center group"
                        >
                            Confirm Order <Send className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                        </button>

                        <p className="text-xs text-center text-slate-400 mt-4">
                            By placing this order, you agree to our <a href="#/shipping-policy" className="underline hover:text-slate-600">Shipping</a> and <a href="#/returns-exchanges" className="underline hover:text-slate-600">Return</a> policies.
                        </p>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutPage;
