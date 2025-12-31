import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, User, CartItem, OrderStatus, FulfillmentStatus, CancellationRequest } from '../types';
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
    placeOrder: (orderData: Partial<Order>) => string;
    updateOrderStatus: (id: string, status: Order['status']) => void;
    addToCart: (product: Product, selectedOptions?: Record<string, string>) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, delta: number) => void;
    clearCart: () => void;
    addReview: (productId: string, review: any) => void;
    cancellationRequests: CancellationRequest[];
    addCancellationRequest: (req: Omit<CancellationRequest, 'id' | 'status' | 'date'>) => void;
    updateCancellationStatus: (requestId: string, status: 'approved' | 'rejected', adminNote?: string) => void;
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

    const addToCart = (product: Product, selectedOptions: Record<string, string> = {}) => {
        setCart(prev => {
            // Generate unique ID based on options
            // Sort keys to ensure consistence: Color-Red, Size-M is same as Size-M, Color-Red
            const optionsString = Object.entries(selectedOptions)
                .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                .map(([key, value]) => `${key}-${value}`)
                .join('_');

            const cartItemId = `${product.id}_${optionsString || 'default'}`;
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
                selectedOptions,
                cartItemId
            }];
        });
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

    const addReview = (productId: string, review: any) => {
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                const currentReviews = p.reviews || [];
                const newReviews = [review, ...currentReviews];

                // Calculate new rating
                const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
                const averageRating = parseFloat((totalRating / newReviews.length).toFixed(1));

                return {
                    ...p,
                    reviews: newReviews,
                    rating: averageRating
                };
            }
            return p;
        }));
    };

    const placeOrder = (orderData: Partial<Order>): string => {
        // Fix: Use one unified Order ID/Number to prevent mismatches
        const uniqueId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
        // Cleaning the ID for display if preferred, or just use the same unique string
        const displayId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`; // Simple 6-digit random

        const orderId = displayId;
        const orderNumber = displayId;

        const newOrder: Order = {
            id: orderId,
            orderNumber, // Now identical to id
            date: new Date().toISOString(),
            status: 'Pending',
            paymentStatus: 'pending',
            fulfillmentStatus: 'unfulfilled',
            timeline: [{
                id: Date.now().toString(),
                date: new Date().toISOString(),
                action: 'Order Placed',
                note: 'Order created by customer'
            }],
            paidAmount: 0,
            subtotal: orderData.totalAmount || 0, // Fallback need calculation ideally
            tax: 0,
            discount: 0,
            type: 'regular', // Logic to detect pre-order/custom items needed if mixed
            customer: {
                name: orderData.customerName || '',
                phone: orderData.customerPhone || '',
            },
            shippingAddress: {
                address: orderData.customerAddress || '',
                city: orderData.city || 'Inside Dhaka'
            },
            billingAddress: {
                address: orderData.customerAddress || '',
                city: orderData.city || 'Inside Dhaka'
            },
            ...orderData
        } as Order;

        setOrders(prev => [newOrder, ...prev]);
        clearCart();
        return newOrder.id;
    };

    const updateOrderStatus = (id: string, status: OrderStatus) => {
        setOrders(prev => prev.map(o => {
            if (o.id === id) {
                // Map legacy status to new fulfillment status
                let fulfillment: FulfillmentStatus = o.fulfillmentStatus || 'unfulfilled';
                if (status === 'Delivered') fulfillment = 'delivered';
                if (status === 'Cancelled') fulfillment = 'cancelled';
                if (status === 'Shipped') fulfillment = 'shipped';
                if (status === 'Processing') fulfillment = 'processing';

                return {
                    ...o,
                    status,
                    fulfillmentStatus: fulfillment,
                    timeline: [
                        ...(o.timeline || []),
                        {
                            id: Date.now().toString(),
                            date: new Date().toISOString(),
                            action: `Status updated to ${status}`,
                            userId: user?.username || 'System'
                        }
                    ]
                };
            }
            return o;
        }));
    };

    const addCategory = (category: string) => {
        if (!categories.includes(category)) {
            setCategories(prev => [...prev, category]);
        }
    };

    // Cancellation Requests State
    // FIXED: Use lazy initialization to prevent overwriting localStorage on mount
    const [cancellationRequests, setCancellationRequests] = useState<CancellationRequest[]>(() => {
        const saved = localStorage.getItem('rupedia_cancellations');
        return saved ? JSON.parse(saved) : [];
    });

    // Removed the useEffect that loads on mount, as lazy init handles it.
    // Only keeping the saver effect.
    useEffect(() => {
        localStorage.setItem('rupedia_cancellations', JSON.stringify(cancellationRequests));
    }, [cancellationRequests]);

    const addCancellationRequest = (req: Omit<CancellationRequest, 'id' | 'status' | 'date'>) => {
        const newReq: CancellationRequest = {
            ...req,
            id: Date.now().toString(),
            status: 'pending',
            date: new Date().toISOString()
        };
        setCancellationRequests(prev => [newReq, ...prev]);
    };

    const updateCancellationStatus = (requestId: string, status: 'approved' | 'rejected', adminNote?: string) => {
        setCancellationRequests(prev => prev.map(req => {
            if (req.id === requestId) {
                return { ...req, status, adminNote };
            }
            return req;
        }));

        if (status === 'approved') {
            const request = cancellationRequests.find(r => r.id === requestId);
            if (request) {
                updateOrderStatus(request.orderId, 'Cancelled');
            }
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
            clearCart,
            addReview,
            cancellationRequests,
            addCancellationRequest,
            updateCancellationStatus
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
