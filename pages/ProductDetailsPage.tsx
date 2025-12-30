import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, ArrowLeft, Star, Share2, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

const ProductDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, addToCart } = useStore();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

    const product = useMemo(() => products.find(p => p.id === id), [id, products]);

    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4);
    }, [product, products]);

    if (!product) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center bg-slate-50">
                <h2 className="text-2xl font-serif text-primary mb-4">Product Not Found</h2>
                <Link to="/shop" className="text-accent underline">Return to Shop</Link>
            </div>
        );
    }

    // Mock multiple images for the gallery
    const images = [
        product.image,
        `https://picsum.photos/400/500?random=${product.id}-2`,
        `https://picsum.photos/400/500?random=${product.id}-3`,
    ];

    // Countdown Logic
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!product?.isPreOrder || !product?.preOrderEndDate) return;

        const calculateTimeLeft = () => {
            const difference = +new Date(product.preOrderEndDate!) - +new Date();

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


    const handleAddToCart = () => {
        // Double check validation just in case
        if ((product.colors?.length > 0 && !selectedColor) || (product.sizes?.length > 0 && !selectedSize)) {
            return;
        }

        // Add multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(product, selectedColor || undefined, selectedSize || undefined);
        }
        // Feedback
        // alert("Added to cart!"); 
        // Better UX: don't alert, just maybe highlight cart or rely on store toast if exists. 
        // For now, no alert is cleaner as cart updates are usually visible via badge.
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


                        {/* Variants */}
                        <div className="space-y-6 mb-8">
                            {product.colors && (
                                <div>
                                    <h3 className="font-medium text-slate-900 mb-2 text-sm">Color</h3>
                                    <div className="flex space-x-2">
                                        {product.colors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color)}
                                                disabled={isExpired} // Disable selection if expired
                                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isExpired ? 'opacity-50 cursor-not-allowed border-slate-200' : selectedColor === color ? 'border-primary ring-1 ring-primary' : 'border-transparent hover:scale-110'}`}
                                                style={{ backgroundColor: color }}
                                                aria-label={`Select color ${color}`}
                                            >
                                                {selectedColor === color && <span className="block w-2 h-2 bg-white rounded-full shadow-sm" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {product.sizes && (
                                <div>
                                    <h3 className="font-medium text-slate-900 mb-2 text-sm">Size</h3>
                                    <div className="flex space-x-2">
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                disabled={isExpired} // Disable selection if expired
                                                className={`px-4 py-2 border rounded-md text-sm transition-all ${isExpired ? 'opacity-50 cursor-not-allowed border-slate-200 text-slate-400' : selectedSize === size ? 'border-primary bg-primary text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-pink-100 mb-6">
                            <div className="flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'description' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    Description
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    Reviews
                                </button>
                            </div>
                        </div>

                        {activeTab === 'description' ? (
                            <div className="prose prose-slate mb-8 animate-fade-in">
                                <p>{product.description}</p>
                                <p className="text-sm mt-4 text-slate-500">
                                    Hand-picked and curated for the finest quality. Each piece tells a unique story and brings elegance to your lifestyle.
                                </p>
                            </div>
                        ) : (
                            <div className="mb-8 space-y-6 animate-fade-in">
                                {product.reviews && product.reviews.length > 0 ? (
                                    product.reviews.map(review => (
                                        <div key={review.id} className="border-b border-slate-50 pb-4 last:border-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="font-semibold text-slate-800">{review.userName}</span>
                                                <div className="flex text-yellow-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-slate-200" : ""} />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-slate-400">{review.date}</span>
                                            </div>
                                            <p className="text-sm text-slate-600">{review.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-lg">
                                        <p>No reviews yet.</p>
                                        <button className="mt-2 text-accent text-sm hover:underline">Be the first to write a review</button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="border-t border-b border-pink-100 py-6 mb-8 space-y-6">
                            {/* Quantity & Add to Cart */}
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
                                {(() => {
                                    const isColorSelected = !product.colors || product.colors.length === 0 || selectedColor;
                                    const isSizeSelected = !product.sizes || product.sizes.length === 0 || selectedSize;
                                    const isAvailable = !isExpired;
                                    const canAddToCart = isColorSelected && isSizeSelected && isAvailable;

                                    return (
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={!canAddToCart}
                                            className={`flex-1 ${!canAddToCart
                                                ? 'bg-slate-300 cursor-not-allowed'
                                                : product.isPreOrder
                                                    ? 'bg-purple-600 hover:bg-purple-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                                    : 'bg-primary hover:bg-blue-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                                                } text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2`}
                                        >
                                            <ShoppingBag size={20} />
                                            {isExpired ? 'Pre-order Ended' : !isColorSelected ? 'Select Color' : !isSizeSelected ? 'Select Size' : product.isPreOrder ? 'Pre-order Now' : 'Add to Cart'}
                                        </button>
                                    );
                                })()}
                            </div>

                            {/* Pre-order Warning */}
                            {product.isPreOrder && (
                                <div className="bg-purple-50 border border-purple-200 p-4 rounded-md">
                                    <p className="text-purple-800 text-sm font-medium flex items-start">
                                        <span className="mr-2">⚠️</span>
                                        Note: This is a pre-order item. Delivery will take 20-30 days after the pre-order period ends.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <Truck size={18} className="text-accent" />
                                <span>Free shipping over ৳2000</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={18} className="text-accent" />
                                <span>30-day return policy</span>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 text-slate-400 hover:text-primary mt-8 w-max transition-colors text-sm">
                            <Share2 size={16} /> Share this product
                        </button>

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
