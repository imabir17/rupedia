import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden mb-4">
            <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium text-slate-900">{question}</span>
                {isOpen ? (
                    <ChevronUp className="text-slate-500" size={20} />
                ) : (
                    <ChevronDown className="text-slate-500" size={20} />
                )}
            </button>
            {isOpen && (
                <div className="px-6 py-4 text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
};

const FAQPage: React.FC = () => {
    const faqs = [
        {
            category: "Orders & Payment",
            items: [
                {
                    question: "How do I place an order?",
                    answer: "You can easily place an order through our website. Simply browse our products, add your desired items to the cart, and proceed to checkout. Follow the instructions to provide your shipping details and choose a payment method."
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept Cash on Delivery (COD) for your convenience. We also support digital payments via bKash and Nagad."
                }
            ]
        },
        {
            category: "Shipping & Delivery",
            items: [
                {
                    question: "What are your delivery charges?",
                    answer: "Our standard delivery charge is 80 BDT inside Dhaka and 130 BDT outside Dhaka."
                },
                {
                    question: "How long does delivery take?",
                    answer: "We aim to deliver your products within 3 to 5 business days, depending on your location."
                },
                {
                    question: "How can I track my order?",
                    answer: "Once your order is shipped, we will provide you with a tracking number or a link to track your order status."
                }
            ]
        },
        {
            category: "Returns & Exchanges",
            items: [
                {
                    question: "What is your return policy?",
                    answer: "We have an 'Open Box' policy. You must check the product in front of the delivery man. If unsatisfied, you can return it immediately. Once accepted, returns or refunds are NOT possible for a change of mind. If we make a mistake (wrong/damaged item), we will take full responsibility."
                },
                {
                    question: "Can I cancel my order?",
                    answer: "For standard items, you can cancel within 48 hours. For Custom Orders, cancellation must be made within 24 hours of confirmation."
                },
                {
                    question: "How do Custom Orders work?",
                    answer: "You can order personalized items like Art Canvases from our Custom Order page. If you have a specific request, you can contact our sales team. Custom orders typically take 5-7 working days to deliver."
                }
            ]
        },
        {
            category: "General",
            items: [
                {
                    question: "Do you have a physical showroom?",
                    answer: "Currently, we operate exclusively as an online store. This allows us to offer you the best prices and a wide selection of products delivered directly to your door."
                },
                {
                    question: "Are your products authentic?",
                    answer: "Yes, we guarantee that all products sold on Rupedia are 100% authentic and sourced directly from verified suppliers."
                }
            ]
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="flex items-center justify-center text-3xl font-serif text-primary mb-4">
                        <HelpCircle className="mr-3" size={32} />
                        Frequently Asked Questions
                    </h1>
                    <p className="text-slate-600">
                        Find answers to common questions about our products, shipping, and policies.
                    </p>
                </div>

                <div className="space-y-8">
                    {faqs.map((section, index) => (
                        <div key={index}>
                            <h2 className="text-xl font-bold text-slate-800 mb-4 ml-1 border-l-4 border-accent pl-3">
                                {section.category}
                            </h2>
                            <div>
                                {section.items.map((faq, faqIndex) => (
                                    <FAQItem key={faqIndex} question={faq.question} answer={faq.answer} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-600">
                        Still have questions? <a href="#" className="text-accent underline hover:text-accent/80">Contact Us</a>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default FAQPage;
