import React from 'react';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 border border-slate-100">
      <div
        className="aspect-[4/5] overflow-hidden bg-slate-100 relative cursor-pointer"
        onClick={() => onAddToCart(product)}
      >
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            loading="lazy"
          />
          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
        {product.isFeatured && (
          <div className="absolute top-2 left-2 bg-accent/90 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider pointer-events-none">
            Bestseller
          </div>
        )}
        {product.isPreOrder && (
          <div className="absolute top-2 right-2 bg-purple-600/90 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider pointer-events-none">
            Pre-order
          </div>
        )}
        {product.isCustomOrder && (
          <div className="absolute top-2 right-2 bg-teal-600/90 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider pointer-events-none">
            Custom Order
          </div>
        )}
        <button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-4 right-4 bg-white text-primary p-2 rounded-full shadow-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary hover:text-white flex items-center gap-2 pr-4"
          aria-label={product.isPreOrder ? "Pre-order now" : product.isCustomOrder ? "Order Custom" : "Add to cart"}
        >
          <Plus size={20} />
          <span className="text-sm font-medium">
            {product.isPreOrder ? "Pre-order" : product.isCustomOrder ? "Order Custom" : "Add"}
          </span>
        </button>
      </div>
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