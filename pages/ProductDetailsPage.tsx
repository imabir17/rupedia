import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowLeft, Star, Share2, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { useToast } from '../context/ToastContext';

const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, addToCart, addReview } = useStore();
    const { showToast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    // Dynamic Options State
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
    const [newReviewRating, setNewReviewRating] = useState(0);

    const product = useMemo(() => products.find(p => p.id === id), [id, products]);

    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4);
    }, [product, products]);

    // Initialize default options if single value exists
    useEffect(() => {
        if (product?.options) {
            const defaults: Record<string, string> = {};
            product.options.forEach(opt => {
                if (opt.values.length === 1) {
                    defaults[opt.name] = opt.values[0];
                }
            });
            if (Object.keys(defaults).length > 0) {
                setSelectedOptions(prev => ({ ...prev, ...defaults }));
            }
        }
    }, [product]);

    if (!product) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-slate-50">
                <h2 className="text-2xl font-serif text-primary mb-4">Product Not Found</h2>
                <Link to="/shop" className="text-accent underline">Return to Shop</Link>
            </div>
        );
    }

    // Use product images or fallback
    const images = product.images && product.images.length > 0
        ? product.images
        : [`https://picsum.photos/400/500?random=${product.id}`];

    // Countdown Logic (kept same)
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!product?.preOrderEnd) return;

        const calculateTimeLeft = () => {
            const endDate = product.preOrderEnd;
            if (!endDate) return;

            const difference = +new Date(endDate) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
                setIsExpired(false);
            } else {
                setTimeLeft(null);
                setIsExpired(true);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [product]);

    const handleOptionSelect = (optionName: string, value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: value
        }));
    };

    const handleAddToCart = () => {
        // Validation: Check if all options are selected
        if (product.options && product.options.length > 0) {
            const missingOptions = product.options.filter(opt => !selectedOptions[opt.name]);
            if (missingOptions.length > 0) {
                showToast(`Please select ${missingOptions.map(o => o.name).join(', ')}`, 'error');
                return;
            }
        }

        // Add multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(product, selectedOptions);
        }

        showToast(`Added ${quantity} ${product.name} to cart`, 'success');
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-4 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb / Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft size={18} className="mr-2" /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Left: Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-white rounded-lg overflow-hidden border border-pink-100 shadow-sm relative group">
                            <img
                                src={images[activeImage]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {product.isFeatured && (
                                <div className="absolute top-4 left-4 bg-accent text-white text-xs font-bold px-3 py-1 uppercase tracking-widest shadow-lg">
                                    Bestseller
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-accent ring-2 ring-accent/20' : 'border-transparent hover:border-pink-200'}`}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-2">
                            <span className="text-xs font-bold tracking-widest text-accent uppercase">{product.category}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif text-primary mb-4">{product.name}</h1>

                        <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-baseline space-x-2">
                                <p className="text-2xl text-slate-800 font-medium">৳{product.price.toFixed(2)}</p>
                                {product.originalPrice && product.originalPrice > product.price && (
                                    <>
                                        <p className="text-lg text-slate-400 line-through">৳{product.originalPrice.toFixed(2)}</p>
                                        <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center text-yellow-500 text-sm">
                                <Star size={16} fill="currentColor" />
                                <span className="text-slate-700 font-bold ml-1">{product.rating || 4.5}</span>
                                <span className="text-slate-400 ml-2">({product.reviews?.length || 12} reviews)</span>
                            </div>
                        </div>

                        {/* Stock & Weight Info */}
                        <div className="mb-6 flex gap-4 text-sm">
                            {product.stock !== undefined && (
                                product.stock === 0 ? (
                                    <span className="text-red-500 font-bold bg-red-50 px-2 py-1 rounded">Out of Stock</span>
                                ) : product.stock < 10 ? (
                                    <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded">Low Stock: Only {product.stock} left!</span>
                                ) : (
                                    <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">In Stock</span>
                                )
                            )}
                            {product.weight && (
                                <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded">Weight: {product.weight}</span>
                            )}
                        </div>

                        {/* Countdown Timer Display */}
                        {product.isPreOrder && product.preOrderEndDate && !isExpired && timeLeft && (
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-lg p-4 mb-6">
                                <p className="text-purple-900 text-xs font-bold uppercase tracking-wider mb-2 text-center">Pre-order Ends In</p>
                                <div className="flex justify-center gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-slate-800">{timeLeft.days}</div>
                                        <div className="text-[10px] uppercase text-slate-500">Days</div>
                                    </div>
                                    <div className="text-xl font-bold text-slate-300">:</div>
                                    <div>
                                        <div className="text-2xl font-bold text-slate-800">{timeLeft.hours}</div>
                                        <div className="text-[10px] uppercase text-slate-500">Hours</div>
                                    </div>
                                    <div className="text-xl font-bold text-slate-300">:</div>
                                    <div>
                                        <div className="text-2xl font-bold text-slate-800">{timeLeft.minutes}</div>
                                        <div className="text-[10px] uppercase text-slate-500">Mins</div>
                                    </div>
                                    <div className="text-xl font-bold text-slate-300">:</div>
                                    <div>
                                        <div className="text-2xl font-bold text-slate-800">{timeLeft.seconds}</div>
                                        <div className="text-[10px] uppercase text-slate-500">Secs</div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {product.isPreOrder && isExpired && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-center">
                                <p className="text-red-700 font-medium">Pre-order Period has Ended</p>
                            </div>
                        )}


                        {/* Dynamic Variants Selection */}
                        {product.options && product.options.length > 0 && (
                            <div className="space-y-6 mb-8">
                                {product.options.map((option, idx) => (
                                    <div key={idx}>
                                        <h3 className="font-medium text-slate-900 mb-2 text-sm">{option.name}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {option.values.map(value => {
                                                const isSelected = selectedOptions[option.name] === value;
                                                const isColor = option.name.toLowerCase() === 'color' || option.name.toLowerCase() === 'colour';

                                                if (isColor) {
                                                    return (
                                                        <button
                                                            key={value}
                                                            onClick={() => handleOptionSelect(option.name, value)}
                                                            disabled={isExpired}
                                                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all 
                                                                ${isExpired ? 'opacity-50 cursor-not-allowed border-slate-200' : isSelected ? 'border-primary ring-1 ring-primary' : 'border-transparent hover:scale-110 shadow-sm'}`}
                                                            style={{ backgroundColor: value.toLowerCase() }}
                                                            title={value}
                                                        >
                                                            {isSelected && <span className="block w-2 h-2 bg-white rounded-full shadow-sm invert mix-blend-difference" />}
                                                        </button>
                                                    );
                                                }

                                                return (
                                                    <button
                                                        key={value}
                                                        onClick={() => handleOptionSelect(option.name, value)}
                                                        disabled={isExpired}
                                                        className={`px-4 py-2 border rounded-md text-sm transition-all 
                                                            ${isExpired ? 'opacity-50 cursor-not-allowed border-slate-200 text-slate-400' :
                                                                isSelected ? 'border-primary bg-primary text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                                                    >
                                                        {value}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Legacy Variants Fallback (Colors/Sizes if valid ops missing) */}
                        {(!product.options || product.options.length === 0) && (product.colors || product.sizes) && (
                            <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded mb-4">
                                Legacy variant data detected. Please update product.
                            </div>
                        )}

                        <div className="border-t border-b border-pink-100 py-6 mb-8 space-y-6">
                            {/* Quantity & Add to Cart */}
                            {/* Pre-order Warning */}
                            {product.isPreOrder && (
                                <div className="bg-purple-50 border border-purple-200 p-4 rounded-md">
                                    <p className="text-purple-800 text-sm font-medium flex items-start">
                                        <span className="mr-2">⚠️</span>
                                        Note: This is a pre-order item. Delivery will take 20-30 days after the pre-order period ends.
                                    </p>
                                </div>
                            )}


                            {/* Add to Cart Logic */}
                            {(() => {
                                const areOptionsSelected = !product.options || product.options.length === 0 || product.options.every(opt => selectedOptions[opt.name]);
                                const isStockAvailable = !product.trackQuantity || (product.stock && product.stock > 0);
                                const canAddToCart = !isExpired && areOptionsSelected && isStockAvailable;

                                return (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex items-center border border-pink-200 rounded-lg bg-white w-max">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={isExpired}
                                                className={`p-3 transition-colors ${isExpired ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-primary'}`}
                                            >
                                                <Minus size={18} />
                                            </button>
                                            <span className={`w-12 text-center font-medium ${isExpired ? 'text-slate-400' : ''}`}>{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                disabled={isExpired}
                                                className={`p-3 transition-colors ${isExpired ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-primary'}`}
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={!canAddToCart}
                                            className={`flex-1 ${!canAddToCart
                                                ? 'bg-slate-300 cursor-not-allowed'
                                                : 'bg-primary hover:bg-blue-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                                } text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2`}
                                        >
                                            <ShoppingBag size={20} />
                                            {isExpired
                                                ? 'Pre-order Ended'
                                                : !isStockAvailable
                                                    ? 'Out of Stock'
                                                    : !areOptionsSelected
                                                        ? 'Select Options'
                                                        : product.type === 'pre-order'
                                                            ? 'Pre-order Now'
                                                            : 'Add to Cart'}
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>



                        <div className="flex flex-col gap-4 mt-8">
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    showToast('Link copied to clipboard!', 'success');
                                }}
                                className="flex items-center gap-2 text-slate-400 hover:text-primary w-max transition-colors text-sm"
                            >
                                <Share2 size={16} /> Share this product
                            </button>
                        </div>

                    </div>
                </div>

                {/* Related Products */}
                {
                    relatedProducts.length > 0 && (
                        <div className="border-t border-pink-100 pt-16">
                            <h2 className="text-2xl font-serif text-primary mb-8">You May Also Like</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Reuse ProductCard logic here, or map existing ProductCard if imported */}
                                {relatedProducts.map(p => (
                                    <div key={p.id} className="group relative bg-white rounded-lg overflow-hidden border border-pink-100 hover:shadow-lg transition-all duration-300">
                                        <Link to={`/product/${p.id}`}>
                                            <div className="aspect-[4/5] overflow-hidden bg-pink-50 relative">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            </div>
                                            <div className="p-4">
                                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{p.category}</p>
                                                <h3 className="font-serif text-md text-primary truncate">{p.name}</h3>
                                                <div className="flex items-baseline space-x-2 mt-1">
                                                    <p className="font-medium text-slate-800">৳{p.price.toFixed(2)}</p>
                                                    {p.originalPrice && (
                                                        <span className="text-xs text-slate-400 line-through">৳{p.originalPrice.toFixed(2)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }

            </div >
        </div >
    );
};

export default ProductDetailsPage;
