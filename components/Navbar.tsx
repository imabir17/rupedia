import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sparkles, Search } from 'lucide-react';
import { CartItem } from '../types';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const { cart } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Logo & Links */}
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0 mr-8">
              <img src="/logo.jpg" alt="Rupedia Logo" className="h-10 w-auto object-contain" />
              <span className="font-serif text-xl font-bold tracking-tight text-primary">
                RUPEDIA
              </span>
            </Link>

            {/* Desktop Links (Moved to Left) */}
            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={`text-slate-600 hover:text-primary transition-all font-medium py-1 border-b-2 ${isActive('/') && location.pathname === '/' ? 'border-blue-600 text-primary' : 'border-transparent'}`}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`text-slate-600 hover:text-primary transition-all font-medium py-1 border-b-2 ${isActive('/shop') ? 'border-blue-600 text-primary' : 'border-transparent'}`}
              >
                Shop
              </Link>
              <Link
                to="/pre-order"
                className={`text-slate-600 hover:text-purple-600 transition-all font-medium py-1 border-b-2 ${isActive('/pre-order') ? 'border-purple-600 text-purple-600' : 'border-transparent'}`}
              >
                Pre-order
              </Link>
              <Link
                to="/custom-order"
                className={`text-slate-600 hover:text-teal-600 transition-all font-medium py-1 border-b-2 ${isActive('/custom-order') ? 'border-teal-600 text-teal-600' : 'border-transparent'}`}
              >
                Custom
              </Link>
              <Link
                to="/order-status"
                className={`text-slate-600 hover:text-orange-600 transition-all font-medium py-1 border-b-2 ${isActive('/order-status') ? 'border-orange-600 text-orange-600' : 'border-transparent'}`}
              >
                Track Order
              </Link>
            </div>
          </div>

          {/* Center Section: Search Bar */}
          <div className="hidden md:flex flex-1 items-center justify-center px-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400 group-focus-within:text-slate-600" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-pink-200 rounded-full leading-5 bg-pink-50 text-primary placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all shadow-sm"
                placeholder="Search products..."
              />
            </form>
          </div>

          {/* Right Section: Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-primary"
            >
              <Search size={24} />
            </button>

            <button
              onClick={onOpenCart}
              className="relative p-2 text-slate-600 hover:text-primary transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-accent rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-slate-600 hover:text-primary transition-transform duration-300"
              aria-label="Toggle Menu"
            >
              <div className={`transition-all duration-300 ${isMenuOpen ? 'rotate-90 scale-110' : 'rotate-0 scale-100'}`}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Expandable) */}
        {isSearchOpen && (
          <div className="md:hidden px-2 py-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-pink-200 rounded-lg leading-5 bg-pink-50 text-primary placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary"
                placeholder="Search products..."
                autoFocus
              />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-pink-100 animate-slide-down origin-top shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link to="/" onClick={toggleMenu} className="block px-3 py-2 text-lg font-medium text-slate-700 hover:bg-pink-50 hover:text-primary rounded-md transition-colors">Home</Link>
            <Link to="/shop" onClick={toggleMenu} className="block px-3 py-2 text-lg font-medium text-slate-700 hover:bg-pink-50 hover:text-primary rounded-md transition-colors">Shop Collection</Link>
            <Link to="/pre-order" onClick={toggleMenu} className="block px-3 py-2 text-lg font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-600 rounded-md transition-colors">Pre-order</Link>
            <Link to="/custom-order" onClick={toggleMenu} className="block px-3 py-2 text-lg font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-600 rounded-md transition-colors">Custom Order</Link>
            <Link to="/order-status" onClick={toggleMenu} className="block px-3 py-2 text-lg font-medium text-slate-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors">Track Order</Link>
            <div className="border-t border-pink-100 my-3"></div>
            <div className="grid grid-cols-2 gap-2">
              {/* Note: In a real app we might want to fetch categories from store, but for mobile menu logic, we need to access store */}
              <MobileMenuCategories toggleMenu={toggleMenu} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Helper component to access store
const MobileMenuCategories: React.FC<{ toggleMenu: () => void }> = ({ toggleMenu }) => {
  const { categories } = useStore();
  return (
    <>
      {categories.map((cat, idx) => (
        <Link
          key={cat}
          to={`/shop?category=${cat}`}
          onClick={toggleMenu}
          className="block px-3 py-2 text-sm text-slate-500 hover:text-primary hover:bg-pink-50 rounded-md transition-colors"
          style={{ animationDelay: `${idx * 50}ms` }}
        >
          {cat}
        </Link>
      ))}
    </>
  );
};

export default Navbar;