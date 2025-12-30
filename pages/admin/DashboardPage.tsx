import React from 'react';
import { useStore } from '../../context/StoreContext';
import { DollarSign, ShoppingBag, Package } from 'lucide-react';

const DashboardPage: React.FC = () => {
    const { products, orders } = useStore();

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;

    return (
        <div>
            <h2 className="text-3xl font-serif text-slate-800 mb-8">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Revenue Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-3 rounded-full text-green-600">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Revenue</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">৳{totalRevenue.toLocaleString()}</p>
                </div>

                {/* Orders Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <ShoppingBag size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Orders</span>
                    </div>
                    <div className="flex items-baseline space-x-2">
                        <p className="text-3xl font-bold text-slate-800">{orders.length}</p>
                        <span className="text-sm text-slate-500">({pendingOrders} Pending)</span>
                    </div>
                </div>

                {/* Products Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                            <Package size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Products</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{products.length}</p>
                </div>
            </div>

            {/* Recent Orders Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Orders</h3>
                {orders.length === 0 ? (
                    <p className="text-slate-500 text-sm">No orders yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="pb-3 font-medium">Order ID</th>
                                    <th className="pb-3 font-medium">Customer</th>
                                    <th className="pb-3 font-medium">Total</th>
                                    <th className="pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.slice(0, 5).map(order => (
                                    <tr key={order.id} className="text-sm">
                                        <td className="py-3 font-mono text-slate-600">#{order.id}</td>
                                        <td className="py-3 text-slate-800">{order.customerName}</td>
                                        <td className="py-3 font-medium text-slate-800">৳{order.totalAmount}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                        'bg-slate-100 text-slate-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
