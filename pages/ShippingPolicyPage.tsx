import React from 'react';
import { Truck, Clock, MapPin } from 'lucide-react';

const ShippingPolicyPage: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-serif text-primary mb-4">Shipping Policy</h1>
                    <p className="text-slate-600">
                        We are committed to delivering your order accurately, in good condition, and always on time.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 space-y-8">

                        {/* Delivery Charges Section */}
                        <section>
                            <h2 className="flex items-center text-xl font-semibold text-primary mb-6">
                                <Truck className="mr-3" size={24} />
                                Delivery Charges
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                                    <div className="flex items-center mb-3">
                                        <MapPin className="text-accent mr-2" size={20} />
                                        <h3 className="font-medium text-slate-900">Inside Dhaka</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-700">80 BDT</p>
                                    <p className="text-sm text-slate-500 mt-1">Standard delivery rate</p>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                                    <div className="flex items-center mb-3">
                                        <MapPin className="text-accent mr-2" size={20} />
                                        <h3 className="font-medium text-slate-900">Outside Dhaka</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-slate-700">130 BDT</p>
                                    <p className="text-sm text-slate-500 mt-1">Standard delivery rate</p>
                                </div>
                            </div>
                        </section>

                        {/* Divider */}
                        <div className="border-t border-slate-100"></div>

                        {/* Delivery Time Section */}
                        <section>
                            <h2 className="flex items-center text-xl font-semibold text-primary mb-4">
                                <Clock className="mr-3" size={24} />
                                Estimated Delivery Time
                            </h2>
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex items-start">
                                <div className="flex-1">
                                    <p className="text-blue-900 font-medium text-lg mb-2">Standard Delivery: 3 to 5 Business Days</p>
                                    <div className="space-y-4 text-blue-800 text-sm leading-relaxed">
                                        <p>
                                            <strong>Standard Orders:</strong> Delivered within 3-5 business days depending on your location.
                                        </p>
                                        <p>
                                            <strong>Custom Orders:</strong> These items are made to order and take 5-7 working days for delivery.
                                        </p>
                                        <p>
                                            <strong>Pre-orders:</strong> Please note that pre-ordered items take 20-30 days for delivery after the pre-order period ends.
                                        </p>
                                        <p className="mt-2 text-blue-700">
                                            Delivery times may vary depending on the destination and external factors such as weather conditions or public holidays.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Additional Notes */}
                        <section className="bg-slate-50 p-6 rounded-lg text-sm text-slate-600">
                            <p>
                                <strong>Note:</strong> Order processing takes place during business days (Sunday to Thursday). Orders placed on Fridays, Saturdays, or public holidays will be processed on the next business day.
                            </p>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicyPage;
