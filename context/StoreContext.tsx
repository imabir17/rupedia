import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, User, CartItem } from '../types';
import { PRODUCTS } from '../constants';

interface StoreContextType {
    products: Product[];
    orders: Order[];
    categories: string[];
    cart: CartItem[];
    user: User | null;
    login: (username: string) => void;
    logout: () => void;
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: string) => void;
    addCategory: (category: string) => void;
    placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => string;
    updateOrderStatus: (id: string, status: Order['status']) => void;
    addToCart: (product: Product, color?: string, size?: string) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, delta: number) => void;
    clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize Products from LocalStorage or Constants
    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem('rupedia_products');
        return saved ? JSON.parse(saved) : PRODUCTS;
    });

    // Initialize Orders from LocalStorage
    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('rupedia_orders');
        return saved ? JSON.parse(saved) : [];
    });

    // Initialize User (Mock Auth)
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('rupedia_user');
        return saved ? JSON.parse(saved) : null;
    });

    // Initialize Categories
    const [categories, setCategories] = useState<string[]>(() => {
        const saved = localStorage.getItem('rupedia_categories');
        return saved ? JSON.parse(saved) : ['Home Decor', 'Stationery', 'Ornaments', 'Makeup'];
    });

    // Initialize Cart
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('rupedia_cart');
        return saved ? JSON.parse(saved) : [];
    });

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('rupedia_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('rupedia_orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('rupedia_categories', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('rupedia_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('rupedia_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('rupedia_user');
        }
    }, [user]);

    // Actions
    const login = (username: string) => {
        // Simple mock login
        setUser({ username, role: 'admin' });
    };

    const logout = () => {
        setUser(null);
    };

    const addToCart = (product: Product, color?: string, size?: string) => {
        setCart(prev => {
            // Unique ID based on Product ID + Variant
            const cartItemId = `${product.id}-${color || 'default'}-${size || 'default'}`;
            const existing = prev.find(item => item.cartItemId === cartItemId);

            if (existing) {
                return prev.map(item =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, {
                ...product,
                quantity: 1,
                selectedColor: color,
                selectedSize: size,
                cartItemId
            }];
        });
        // Note: We deliberately do NOT trigger "open cart" sidebar here
    };

    const removeFromCart = (cartItemId: string) => {
        setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.cartItemId === cartItemId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCart([]);
    };

    const addProduct = (product: Product) => {
        setProducts(prev => [product, ...prev]);
    };

    const updateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const placeOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>): string => {
        const newOrder: Order = {
            ...orderData,
            id: `ORD-${Date.now().toString().slice(-6)}`,
            date: new Date().toISOString(),
            status: 'Pending'
        };
        setOrders(prev => [newOrder, ...prev]);
        clearCart(); // Clear cart after order
        return newOrder.id;
    };

    const updateOrderStatus = (id: string, status: Order['status']) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    };

    const addCategory = (category: string) => {
        if (!categories.includes(category)) {
            setCategories(prev => [...prev, category]);
        }
    };

    return (
        <StoreContext.Provider value={{
            products,
            orders,
            categories,
            cart,
            user,
            login,
            logout,
            addProduct,
            updateProduct,
            deleteProduct,
            addCategory,
            placeOrder,
            updateOrderStatus,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
