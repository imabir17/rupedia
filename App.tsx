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
import OrderConfirmationPage from './pages/OrderConfirmationPage';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import OrderListPage from './pages/admin/OrderListPage';

import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';
import { StoreProvider } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';

// ScrollToTop component to handle route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <StoreProvider>
        <ToastProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar onOpenCart={() => setIsCartOpen(true)} />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                <Route path="/returns-exchanges" element={<ReturnsExchangesPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/pre-order" element={<PreOrderPage />} />
                <Route path="/custom-order" element={<CustomOrderPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="products" element={<ProductListPage />} />
                  <Route path="products/new" element={<ProductFormPage />} />
                  <Route path="products/:id" element={<ProductFormPage />} />
                  <Route path="orders" element={<OrderListPage />} />
                </Route>
              </Routes>
            </main>

            <Footer />

            <CartDrawer
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />

            <ChatBubble />
          </div>
        </ToastProvider>
      </StoreProvider>
    </Router>
  );
};

export default App;