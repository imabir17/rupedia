import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle, XCircle, AlertCircle, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const AdminCancellationPage: React.FC = () => {
    const { cancellationRequests, updateCancellationStatus } = useStore();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const filteredRequests = cancellationRequests
        .filter(req => filter === 'all' || req.status === filter)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        if (action === 'approve') {
            if (window.confirm('Are you sure? This will cancel the order and update inventory.')) {
                updateCancellationStatus(id, 'approved', 'Approved by Admin');
                showToast('Request approved and order cancelled.', 'success');
            }
        } else {
            const reason = window.prompt('Enter rejection reason for customer:');
            if (reason) {
                updateCancellationStatus(id, 'rejected', reason);
                showToast('Request rejected.', 'success');
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif text-slate-900">Cancellation Requests</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage customer cancellation requests.</p>
                </div>
                <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'rejected'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Order</th>
                            <th className="px-6 py-4 font-semibold">Customer</th>
                            <th className="px-6 py-4 font-semibold">Reason</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map(req => (
                                <tr key={req.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(req.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => navigate(`/admin/orders/${req.orderId}`)} className="font-mono font-medium text-primary hover:underline">
                                            {/* We might want to look up friendly Order Number here if feasible, using orderId for now */}
                                            Order #{req.orderId.substring(0, 8)}...
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-900">{req.customerName}</div>
                                        <div className="text-xs text-slate-500">{req.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-700 max-w-xs">{req.reason}</div>
                                        {req.transactionId && <div className="text-xs text-slate-400 mt-1">TrxID: {req.transactionId}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {req.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(req.id, 'approve')}
                                                    className="text-green-600 hover:text-green-700 bg-green-50 p-2 rounded hover:bg-green-100 transition-colors"
                                                    title="Approve & Cancel Order"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req.id, 'reject')}
                                                    className="text-red-600 hover:text-red-700 bg-red-50 p-2 rounded hover:bg-red-100 transition-colors"
                                                    title="Reject Request"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center">
                                        <Clock size={48} className="text-slate-300 mb-2" />
                                        <p>No cancellation requests found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCancellationPage;
