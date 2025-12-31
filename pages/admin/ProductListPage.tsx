import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Edit2, Trash2, Plus, Search, Filter } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const ProductListPage: React.FC = () => {
    const { products, deleteProduct, categories } = useStore();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || product.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

        return matchesSearch && matchesType && matchesStatus && matchesCategory;
    });

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-serif text-slate-800">Products</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your catalog, inventory, and variants.</p>
                </div>
                <NavLink
                    to="/admin/products/new"
                    className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Add Product</span>
                </NavLink>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full md:w-40 px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                    <option value="all">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full md:w-40 px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                    <option value="all">All Types</option>
                    <option value="regular">Regular</option>
                    <option value="pre-order">Pre-Order</option>
                    <option value="custom">Custom</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full md:w-40 px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Product</th>
                                <th className="px-6 py-4 font-semibold">SKU / Type</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Stock</th>
                                <th className="px-6 py-4 font-semibold">Price</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <span className="block font-medium text-slate-900">{product.name}</span>
                                                <span className="text-xs text-slate-500">{product.category}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <div className="font-mono text-slate-600 mb-1">{product.sku}</div>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize
                                                ${product.type === 'pre-order' ? 'bg-purple-100 text-purple-700' :
                                                    product.type === 'custom' ? 'bg-teal-100 text-teal-700' :
                                                        'bg-slate-100 text-slate-600'}`}>
                                                {product.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${product.status === 'published' ? 'bg-green-100 text-green-800' :
                                                product.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {product.trackQuantity ? (
                                            <span className={product.stock <= 10 ? 'text-red-600 font-medium' : ''}>
                                                {product.stock} in stock
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 italic">Not tracked</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">৳{product.price}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                            onClick={() => navigate(`/admin/products/${product.id}`)}
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                {filteredProducts.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <Filter size={48} className="mx-auto text-slate-300 mb-3" />
                        <p>No products found matching your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListPage;
