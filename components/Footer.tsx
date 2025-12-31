import React from 'react';
import { Facebook, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-xl text-white mb-4">RUPEDIA</h3>
          <p className="text-sm text-slate-300 max-w-xs">
            Curating elegance for your home and lifestyle. Discover our handpicked collection of decor, stationery, and beauty essentials.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Customer Care</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shipping-policy" className="hover:text-white transition">Shipping Policy</Link></li>
            <li><Link to="/returns-exchanges" className="hover:text-white transition">Returns & Exchanges</Link></li>
            <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
            <li><Link to="/order-status" className="hover:text-white transition">Track My Order</Link></li>
            <li className="pt-2 text-slate-400">
              <span className="block">Phone: 01308811838</span>
              <span className="block">Email: rupediaa@gmail.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4">Connect With Us</h4>
          <div className="flex space-x-4 mb-4">
            <a href="https://www.facebook.com/profile.php?id=100069429382001" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition"><Facebook size={20} /></a>
            <a href="https://www.instagram.com/rupedia_" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition"><Instagram size={20} /></a>
            <a href="mailto:rupediaa@gmail.com" className="hover:text-accent transition"><Mail size={20} /></a>
          </div>
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} RUPEDIA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;