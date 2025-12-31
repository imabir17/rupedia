import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatBubble: React.FC = () => {
    return (
        <a
            href="https://wa.me/8801308811838"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            aria-label="Chat with us on WhatsApp"
        >
            <MessageCircle size={28} fill="currentColor" className="text-white" />
        </a>
    );
};

export default ChatBubble;
