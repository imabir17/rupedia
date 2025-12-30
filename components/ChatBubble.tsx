import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatBubble: React.FC = () => {
    return (
        <a
            href="https://www.facebook.com/messages/t/100226025447991/"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
            aria-label="Chat with us on Facebook"
        >
            <MessageCircle size={28} fill="currentColor" className="text-white" />
        </a>
    );
};

export default ChatBubble;
