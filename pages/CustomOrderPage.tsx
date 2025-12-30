import React from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { Palette, Mail } from 'lucide-react';

interface CustomOrderPageProps {
    onAddToCart: (product: Product) => void;
}

const CustomOrderPage: React.FC<CustomOrderPageProps> = ({ onAddToCart }) => {
    const customProducts = PRODUCTS.filter(p => p.isCustomOrder);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Header */}
            <div className="bg-teal-900 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="font-serif text-4xl md:text-5xl mb-4">Custom Orders</h1>
                    <p className="text-teal-100 text-lg max-w-2xl mx-auto">
                        Personalize your space with our custom-made items.
                        From art canvases to nameplates, we bring your vision to life.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="inline-flex items-center bg-teal-800/50 px-6 py-3 rounded-full border border-teal-500/30">
                            <Palette className="mr-2 text-teal-300" size={20} />
                            <span className="text-sm font-medium">Delivery: 5-7 Working Days</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20">
                <h2 className="text-2xl font-serif text-primary mb-8 border-l-4 border-teal-500 pl-4">Available Custom Items</h2>
                {customProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {customProducts.map(product => (
                            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500">No custom items available at the moment.</p>
                )}
            </div>

            {/* Request a Product Section */}
            <div className="bg-white py-16 border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-serif text-primary mb-4">Can't find what you're looking for?</h2>
                    <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                        We accept special requests! If you have a specific design or product in mind, our team can help create it for you.
                    </p>
                    <a
                        href="mailto:rupediaa@gmail.com?subject=Product%20Request"
                        className="inline-flex items-center bg-teal-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        <Mail className="mr-2" size={20} />
                        Request a Product
                    </a>
                    <p className="text-sm text-slate-400 mt-4">
                        Note: Custom requests are subject to approval and may have different pricing and delivery timelines.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CustomOrderPage;
