import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Product, ProductType, ProductStatus, ProductVariant } from '../../types';
import { Save, ArrowLeft, Image as ImageIcon, Plus, Trash2, Box, Tag, Layers, Truck, Globe, Settings } from 'lucide-react';

const ProductFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, categories, addProduct, updateProduct, addCategory } = useStore();

    const isEditMode = !!id;

    // --- State ---
    const [activeTab, setActiveTab] = useState<'general' | 'media' | 'pricing' | 'inventory' | 'variants' | 'seo'>('general');

    // Initial State Template
    const initialProduct: Partial<Product> = {
        name: '',
        sku: `SKU-${Date.now()}`,
        type: 'regular',
        status: 'draft',
        category: categories[0] || '',
        price: 0,
        description: '',
        images: [],
        stock: 0,
        trackQuantity: true,
        variants: [],
        options: [],
        isFeatured: false,
    };

    const [formData, setFormData] = useState<Partial<Product>>(initialProduct);
    const [newImage, setNewImage] = useState('');
    const [variantOptionName, setVariantOptionName] = useState('');
    const [variantOptionValues, setVariantOptionValues] = useState('');

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

    // --- Handlers ---
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

    const handleAddImage = () => {
        if (newImage && !formData.images?.includes(newImage)) {
            setFormData(prev => ({ ...prev, images: [...(prev.images || []), newImage] }));
            setNewImage('');
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== index) }));
    };

    const handleAddOption = () => {
        if (variantOptionName && variantOptionValues) {
            const newOption = {
                name: variantOptionName,
                values: variantOptionValues.split(',').map(s => s.trim()).filter(s => s)
            };
            setFormData(prev => ({
                ...prev,
                options: [...(prev.options || []), newOption],
                // Simple variant generation logic (just placeholder for now)
                variants: []
            }));
            setVariantOptionName('');
            setVariantOptionValues('');
        }
    };

    const removeOption = (index: number) => {
        setFormData(prev => ({ ...prev, options: prev.options?.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productToSave = {
            ...formData,
            id: isEditMode && id ? id : `PROD-${Date.now()}`,
            // Ensure required fields
            rating: formData.rating || 0,
            reviews: formData.reviews || [],
            variants: formData.variants || [],
            options: formData.options || [],
            images: formData.images || []
        } as Product;

        if (isEditMode) {
            updateProduct(productToSave);
        } else {
            addProduct(productToSave);
        }
        navigate('/admin/products');
    };

    // --- Tab Content ---

    const renderGeneralTab = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                        placeholder="e.g. Classic White T-Shirt"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                    >
                        <option value="regular">Regular Product</option>
                        <option value="pre-order">Pre-Order</option>
                        <option value="custom">Custom / Made-to-Order</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        rows={6}
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>

            {/* Conditional Type Fields */}
            {formData.type === 'pre-order' && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mt-4">
                    <h4 className="text-purple-800 font-medium mb-3 flex items-center"><Box size={18} className="mr-2" /> Pre-Order Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-purple-700 mb-1">Pre-Order End Date</label>
                            <input
                                type="date"
                                name="preOrderEnd"
                                value={formData.preOrderEnd || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-purple-200 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-purple-700 mb-1">Shipping Starts</label>
                            <input
                                type="date"
                                name="shippingDate"
                                value={formData.shippingDate || ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-purple-200 rounded-md"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderMediaTab = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
                <ImageIcon className="mx-auto text-slate-400 mb-2" size={48} />
                <p className="text-slate-500 mb-4">Add images by URL (Demo Phase)</p>
                <div className="flex max-w-md mx-auto gap-2">
                    <input
                        type="text"
                        value={newImage}
                        onChange={e => setNewImage(e.target.value)}
                        placeholder="https://..."
                        className="flex-grow px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                    <button
                        type="button"
                        onClick={handleAddImage}
                        className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700"
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images?.map((img, idx) => (
                    <div key={idx} className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                        <img src={img} alt="Product" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                        {idx === 0 && <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">Main</span>}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPricingTab = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price (BDT)</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">৳</span>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Compare-at Price (Optional)</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">৳</span>
                    <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice || ''}
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cost Price (Internal)</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">৳</span>
                    <input
                        type="number"
                        name="costPrice"
                        value={formData.costPrice || ''}
                        onChange={handleChange}
                        className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                </div>
                <p className="text-xs text-slate-500 mt-1">Customers won't see this.</p>
            </div>
        </div>
    );

    const renderInventoryTab = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">SKU (Stock Keeping Unit)</label>
                    <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Barcode (ISBN, UPC, GTIN)</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <input
                    type="checkbox"
                    name="trackQuantity"
                    checked={formData.trackQuantity}
                    onChange={handleChange}
                    className="h-5 w-5 text-primary focus:ring-primary border-slate-300 rounded"
                />
                <div>
                    <span className="block text-sm font-medium text-slate-800">Track Quantity</span>
                    <span className="text-xs text-slate-500">Automatically decrease stock when orders are placed.</span>
                </div>
            </div>

            {formData.trackQuantity && (
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Quantity Available</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock || 0}
                        onChange={handleChange}
                        className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                </div>
            )}
        </div>
    );

    // Simplified Variant View for Prototype
    const renderVariantsTab = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-800 mb-4">Add Options (e.g. Size, Color)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Option Name (e.g. Color)"
                            value={variantOptionName}
                            onChange={e => setVariantOptionName(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Values (comma separated)"
                            value={variantOptionValues}
                            onChange={e => setVariantOptionValues(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddOption}
                        className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition"
                    >
                        Add Option
                    </button>
                </div>
            </div>

            {formData.options && formData.options.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-medium text-slate-800">Option Sets</h4>
                    {formData.options.map((opt, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg">
                            <div>
                                <span className="font-bold text-slate-700">{opt.name}:</span>
                                <span className="ml-2 text-slate-600">{opt.values.join(', ')}</span>
                            </div>
                            <button onClick={() => removeOption(idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-full">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center">
                        <button type="button" onClick={() => navigate('/admin/products')} className="mr-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-3xl font-serif text-slate-800">
                                {isEditMode ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {formData.name || 'Untitled Product'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={() => navigate('/admin/products')} className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-blue-900 font-medium flex items-center shadow-lg hover:shadow-xl transition-all">
                            <Save size={18} className="mr-2" /> Save Product
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1 space-y-2">
                        {[
                            { id: 'general', label: 'General', icon: Box },
                            { id: 'media', label: 'Media', icon: ImageIcon },
                            { id: 'pricing', label: 'Pricing', icon: Tag },
                            { id: 'inventory', label: 'Inventory', icon: Layers },
                            { id: 'variants', label: 'Variants', icon: Settings },
                            { id: 'shipping', label: 'Shipping', icon: Truck },
                            { id: 'seo', label: 'SEO', icon: Globe },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-blue-50 text-primary'
                                        : 'text-slate-600 hover:bg-white hover:text-slate-900'
                                    }`}
                            >
                                <tab.icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[500px]">
                        {activeTab === 'general' && renderGeneralTab()}
                        {activeTab === 'media' && renderMediaTab()}
                        {activeTab === 'pricing' && renderPricingTab()}
                        {activeTab === 'inventory' && renderInventoryTab()}
                        {activeTab === 'variants' && renderVariantsTab()}
                        {activeTab === 'shipping' && <div className="text-slate-500 italic">Shipping configuration...</div>}
                        {activeTab === 'seo' && <div className="text-slate-500 italic">SEO settings...</div>}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;
