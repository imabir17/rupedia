import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ChatBubble from './components/ChatBubble';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import ReturnsExchangesPage from './pages/ReturnsExchangesPage';
import FAQPage from './pages/FAQPage';
import PreOrderPage from './pages/PreOrderPage';
import CustomOrderPage from './pages/CustomOrderPage';
import ContactPage from './pages/ContactPage';
import CheckoutPage from './pages/CheckoutPage';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';

// ScrollToTop component to handle route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar cart={cart} onOpenCart={() => setIsCartOpen(true)} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage products={PRODUCTS} onAddToCart={handleAddToCart} />} />
            <Route path="/shop" element={<ShopPage products={PRODUCTS} onAddToCart={handleAddToCart} />} />
            <Route path="/product/:id" element={<ProductDetailsPage onAddToCart={handleAddToCart} />} />
            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="/returns-exchanges" element={<ReturnsExchangesPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/pre-order" element={<PreOrderPage onAddToCart={handleAddToCart} />} />
            <Route path="/custom-order" element={<CustomOrderPage onAddToCart={handleAddToCart} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/checkout" element={<CheckoutPage cart={cart} />} />
          </Routes>
        </main>

        <Footer />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onRemove={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
        />

        <ChatBubble />
      </div>
    </Router>
  );
};

export default App;