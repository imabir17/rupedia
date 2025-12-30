import React from 'react';
import { Phone, Mail, Facebook, Instagram, MessageCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-serif text-primary mb-4">Contact Us</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        We'd love to hear from you. Whether you have a question about an order,
                        want to request a custom product, or just want to say hello, we're here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Info Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-8 space-y-8 h-full">
                        <h2 className="text-xl font-semibold text-primary mb-6">Get in Touch</h2>

                        {/* Phone / WhatsApp */}
                        <div className="flex items-start space-x-4">
                            <div className="bg-green-100 p-3 rounded-full text-green-600">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900">Phone & WhatsApp</h3>
                                <p className="text-slate-500 text-sm mb-2">Available 10 AM - 10 PM</p>
                                <a href="tel:+8801308811838" className="block text-lg font-bold text-slate-800 hover:text-green-600 transition-colors">
                                    01308811838
                                </a>
                                <a
                                    href="https://wa.me/8801308811838"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-sm text-green-600 font-medium mt-1 hover:underline"
                                >
                                    <MessageCircle size={16} className="mr-1" /> Chat on WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-900">Email</h3>
                                <p className="text-slate-500 text-sm mb-2">For general inquiries & support</p>
                                <a href="mailto:rupediaa@gmail.com" className="text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors">
                                    rupediaa@gmail.com
                                </a>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="font-medium text-slate-900 mb-4">Follow Us</h3>
                            <div className="flex space-x-4">
                                <a
                                    href="https://www.facebook.com/profile.php?id=100069429382001"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-slate-100 p-3 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                                    aria-label="Facebook"
                                >
                                    <Facebook size={24} />
                                </a>
                                <a
                                    href="https://www.instagram.com/rupedia_"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-slate-100 p-3 rounded-full text-pink-600 hover:bg-pink-600 hover:text-white transition-all"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={24} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Simple Message Form (Visual Only for now) */}
                    <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-8 h-full">
                        <h2 className="text-xl font-semibold text-primary mb-6">Send a Message</h2>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all system-ui" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all system-ui" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                <textarea rows={4} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all system-ui" placeholder="How can we help?"></textarea>
                            </div>
                            <button className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/10">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
