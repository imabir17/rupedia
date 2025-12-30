import React from 'react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Clock } from 'lucide-react';

import { useStore } from '../context/StoreContext';

const PreOrderPage: React.FC = () => {
    const { products } = useStore();
    const preOrderProducts = products.filter(p => p.isPreOrder);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Header */}
            <div className="bg-purple-900 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Exclusive Pre-orders</h1>
                    <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                        Reserve your favorite upcoming items before they arrive.
                        Please note that pre-ordered items take 20-30 days for delivery after the pre-order period of a product ends.
                    </p>
                    <div className="mt-8 inline-flex items-center bg-purple-800/50 px-6 py-3 rounded-full border border-purple-500/30">
                        <Clock className="mr-2 text-purple-300" size={20} />
                        <span className="text-sm font-medium">Estimated Delivery: 20-30 Days</span>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {preOrderProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {preOrderProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h2 className="text-xl text-slate-600 mb-4">No pre-order items available right now.</h2>
                        <p className="text-slate-500">Check back later for exclusive releases.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreOrderPage;
