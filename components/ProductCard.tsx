import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  // onAddToCart prop removed
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-slate-100">
      <Link to={`/product/${product.id}`} className="block relative cursor-pointer aspect-[4/5] overflow-hidden bg-slate-100">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400x500'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          loading="lazy"
        />
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {product.isFeatured && (
          <div className="absolute top-2 left-2 bg-accent/90 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider pointer-events-none">
            Bestseller
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
            <span className="bg-slate-800 text-white px-3 py-1 text-sm font-bold uppercase tracking-widest transform -rotate-12 border-2 border-slate-800">Out of Stock</span>
          </div>
        )}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm pointer-events-none z-20">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}
        {product.isPreOrder && (
          <div className="absolute top-10 right-2 bg-purple-600/90 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider pointer-events-none">
            Pre-order
          </div>
        )}
        {product.isCustomOrder && (
          <div className="absolute top-10 right-2 bg-teal-600/90 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider pointer-events-none">
            Custom Order
          </div>
        )}

        {/* Changed button to just be a visual indicator or link, not an add to cart action */}
        <div
          className="absolute bottom-4 right-4 bg-white text-primary p-2 rounded-full shadow-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white flex items-center gap-2 pr-4"
        //   aria-label="View Details"
        >
          <ShoppingBag size={20} />
          <span className="text-sm font-medium">View</span>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">{product.category}</p>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-serif text-lg text-primary truncate hover:text-accent transition-colors">{product.name}</h3>
        </Link>
        <div className="flex justify-between items-center mt-2">
          <span className="font-medium text-slate-800">৳{product.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;