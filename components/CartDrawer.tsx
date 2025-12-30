import React from 'react';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity } = useStore();
  // Map store actions to local names if needed or use directly
  const onRemove = removeFromCart;
  const onUpdateQuantity = updateQuantity;
  const navigate = useNavigate();
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-primary/30 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="w-full h-full bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-pink-100 flex items-center justify-between">
            <h2 className="font-serif text-xl text-primary">Shopping Bag</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-primary">
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-slate-400">
                  <ArrowRight size={24} />
                </div>
                <p className="text-slate-500">Your bag is empty.</p>
                <button
                  onClick={onClose}
                  className="text-accent hover:text-accent/80 font-medium underline underline-offset-4"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.cartItemId} className="flex space-x-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-pink-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-primary">
                        <h3>{item.name}</h3>
                        <p className="ml-4">৳{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.category}
                        {item.selectedColor && <span className="ml-2 text-xs border border-slate-200 px-1 rounded">Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span className="ml-2 text-xs border border-slate-200 px-1 rounded">Size: {item.selectedSize}</span>}
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-slate-300 rounded-sm">
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-2 text-primary font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                          className="px-2 py-1 hover:bg-slate-100 text-slate-600"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemove(item.cartItemId)}
                        className="font-medium text-rose-500 hover:text-rose-700 flex items-center space-x-1"
                      >
                        <Trash2 size={16} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-pink-100 px-6 py-6 bg-pink-50">
              <div className="flex justify-between text-base font-medium text-primary mb-4">
                <p>Subtotal</p>
                <p>৳{total.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-slate-500 mb-6">
                Shipping and taxes calculated at checkout.
              </p>
              <button
                className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-900 transition-colors"
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
              >
                Checkout
              </button>
              <button
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors mt-3"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;