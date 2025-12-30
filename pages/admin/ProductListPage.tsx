import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const ProductListPage: React.FC = () => {
    const { products, deleteProduct } = useStore();
    const navigate = useNavigate();

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-serif text-slate-800">Products</h2>
                <NavLink
                    to="/admin/products/new"
                    className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                >
                    <Plus size={18} />
                    <span>Add Product</span>
                </NavLink>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-semibold">Product</th>
                            <th className="px-6 py-4 font-semibold">Category</th>
                            <th className="px-6 py-4 font-semibold">Price</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-medium text-slate-900">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 text-sm">
                                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium">{product.category}</span>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">৳{product.price}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        className="text-slate-400 hover:text-blue-600 transition-colors"
                                        title="Edit"
                                        onClick={() => navigate(`/admin/products/${product.id}`)}
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-slate-400 hover:text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductListPage;
