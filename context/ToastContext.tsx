import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
              pointer-events-auto
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg 
              transform transition-all duration-300 animate-slide-up
              ${toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : ''}
              ${toast.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : ''}
              ${toast.type === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' : ''}
            `}
                        role="alert"
                    >
                        {toast.type === 'success' && <CheckCircle size={20} className="text-green-600" />}
                        {toast.type === 'error' && <AlertCircle size={20} className="text-red-600" />}
                        {toast.type === 'info' && <Info size={20} className="text-blue-600" />}

                        <p className="text-sm font-medium pr-2">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
