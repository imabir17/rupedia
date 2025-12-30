import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Save, ArrowLeft } from 'lucide-react';

const ProductFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, categories, addProduct, updateProduct, addCategory } = useStore();

    const isEditMode = !!id;

    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        category: categories[0] || '',
        price: 0,
        originalPrice: 0,
        description: '',
        image: '',
        isFeatured: false,
        isPreOrder: false,
        isCustomOrder: false,
    });

    useEffect(() => {
        if (isEditMode && id) {
            const productToEdit = products.find(p => p.id === id);
            if (productToEdit) {
                setFormData(productToEdit);
            } else {
                navigate('/admin/products');
            }
        }
    }, [isEditMode, id, products, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditMode && id) {
            updateProduct({ ...formData, id } as Product);
        } else {
            const newProduct = {
                ...formData,
                id: `PROD-${Date.now()}`,
                rating: 0,
                reviews: []
            } as Product;
            addProduct(newProduct);
        }
        navigate('/admin/products');
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate('/admin/products')} className="mr-4 text-slate-400 hover:text-slate-600">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-3xl font-serif text-slate-800">
                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <div className="flex gap-2">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                            >
                                <option value="" disabled>Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => {
                                    const newCat = prompt('Enter new category name:');
                                    if (newCat) {
                                        addCategory(newCat);
                                        setFormData(prev => ({ ...prev, category: newCat }));
                                    }
                                }}
                                className="px-3 py-2 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 text-sm font-medium whitespace-nowrap"
                            >
                                + New
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                        <input
                            type="text"
                            name="image"
                            required
                            placeholder="https://..."
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Price (BDT)</label>
                        <input
                            type="number"
                            name="price"
                            required
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Original Price (Optional)</label>
                        <input
                            type="number"
                            name="originalPrice"
                            min="0"
                            value={formData.originalPrice}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>

                {/* Variants & Inventory */}
                <div>
                    <h3 className="text-lg font-medium text-slate-800 mb-4 border-b pb-2">Inventory & Variants</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                required
                                value={formData.stock || 0}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Weight (e.g., 500g, 1kg)</label>
                            <input
                                type="text"
                                name="weight"
                                value={formData.weight || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Colors (comma separated)</label>
                            <input
                                type="text"
                                placeholder="Red, #FF0000, Blue"
                                value={formData.colors?.join(', ') || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, colors: e.target.value.split(',').map(s => s.trim()) }))}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Sizes (comma separated)</label>
                            <input
                                type="text"
                                placeholder="S, M, L, XL"
                                value={formData.sizes?.join(', ') || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, sizes: e.target.value.split(',').map(s => s.trim()) }))}
                                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-primary focus:border-primary"
                    />
                </div>

                {/* Flags */}
                <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-100">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="isFeatured"
                            checked={formData.isFeatured}
                            onChange={handleChange}
                            className="w-4 h-4 text-primary rounded ring-offset-2 focus:ring-primary border-slate-300"
                        />
                        <span className="ml-2 text-sm text-slate-700">Featured Product</span>
                    </label>

                    <div>
                        <label className="flex items-center space-x-2 cursor-pointer mb-4">
                            <input
                                type="checkbox"
                                name="isPreOrder"
                                checked={formData.isPreOrder}
                                onChange={handleChange}
                                className="rounded border-slate-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm font-medium text-slate-700">Pre-order Item</span>
                        </label>

                        {formData.isPreOrder && (
                            <div className="ml-6 mb-4 animate-fade-in">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Pre-order End Date
                                </label>
                                <input
                                    type="date"
                                    name="preOrderEndDate"
                                    value={formData.preOrderEndDate || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    required={formData.isPreOrder}
                                />
                                <p className="text-xs text-slate-500 mt-1">Orders will be disabled after this date.</p>
                            </div>
                        )}
                    </div>

                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="isCustomOrder"
                            checked={formData.isCustomOrder}
                            onChange={handleChange}
                            className="w-4 h-4 text-teal-600 rounded ring-offset-2 focus:ring-teal-600 border-slate-300"
                        />
                        <span className="ml-2 text-sm text-slate-700">Custom Order Item</span>
                    </label>
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-900 transition flex items-center"
                    >
                        <Save size={20} className="mr-2" />
                        Save Product
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ProductFormPage;
