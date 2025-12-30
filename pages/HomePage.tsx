import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';

interface HomePageProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({ products, onAddToCart }) => {
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-pink-50 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/1920/1080?grayscale&blur=2"
            alt="Interior background"
            className="w-full h-full object-cover opacity-30 mix-blend-multiply"
          />
        </div>
        <div className="relative z-10 text-center max-w-4xl px-4 animate-fade-in-up">
          <span className="text-accent uppercase tracking-[0.2em] text-sm font-bold mb-4 block">Est. 2021</span>
          <h1 className="font-serif text-5xl md:text-7xl text-primary mb-6 leading-tight">
            RUPEDIA <br /> <span className="text-3xl md:text-5xl font-light italic">Artistry in Every Detail</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Discover our exclusive collection of home decor, fine stationery, and beauty essentials designed to inspire.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/shop"
              className="px-8 py-4 bg-primary text-white font-medium rounded-sm hover:bg-blue-900 transition-colors flex items-center justify-center"
            >
              Shop Collection <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link
              to="/shop?category=Home Decor"
              className="px-8 py-4 bg-white text-primary font-medium rounded-sm border border-pink-200 hover:border-primary transition-colors"
            >
              Explore Decor
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up animation-delay-200">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl text-primary mb-2">Shop by Category</h2>
          <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(Category).map((cat, idx) => (
            <Link
              key={cat}
              to={`/shop?category=${cat}`}
              className="group relative h-64 overflow-hidden rounded-lg cursor-pointer"
            >
              <img
                src={`https://picsum.photos/600/800?random=${20 + idx}`}
                alt={cat}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white font-serif text-2xl font-bold tracking-wide group-hover:-translate-y-2 transition-transform duration-300">
                  {cat}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-16 animate-fade-in-up animation-delay-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-serif text-3xl text-primary">Featured items</h2>
              <p className="text-slate-500 mt-2">Handpicked favorites just for you.</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center text-accent font-medium hover:text-accent/80 transition-colors">
              View all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/shop" className="inline-flex items-center text-accent font-medium">
              View all <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial / Story */}
      <section className="bg-pink-50 py-20 border-y border-pink-100 animate-fade-in-up animation-delay-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center space-x-1 mb-6 text-yellow-500">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
          </div>
          <blockquote className="font-serif text-2xl md:text-3xl text-primary italic mb-8 leading-relaxed">
            "RUPEDIA transformed my home office into a sanctuary. The quality of their stationery and decor is unmatched. It's not just shopping; it's an experience."
          </blockquote>
          <cite className="not-italic font-medium text-slate-500 tracking-wide uppercase text-sm">
            — Sarah Mitchell, Interior Designer
          </cite>
        </div>
      </section>
    </div>
  );
};

export default HomePage;