import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import ChatBubble from '../components/ChatBubble';

const PublicLayout: React.FC = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar onOpenCart={() => setIsCartOpen(true)} />

            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />

            <ChatBubble />
        </div>
    );
};

export default PublicLayout;
