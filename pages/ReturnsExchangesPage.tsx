import React from 'react';
import { RotateCcw, PackageCheck, Ban, ShieldCheck, Clock } from 'lucide-react';

const ReturnsExchangesPage: React.FC = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-serif text-primary mb-4">Returns & Exchanges Policy</h1>
                    <p className="text-slate-600">
                        Please read our policy carefully to understand our returns, refunds, and cancellation processes.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 space-y-8">

                        {/* Open Box Policy */}
                        <section>
                            <h2 className="flex items-center text-xl font-semibold text-primary mb-4">
                                <PackageCheck className="mr-3 text-accent" size={24} />
                                Open Box Delivery Policy
                            </h2>
                            <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
                                <p className="text-amber-900 leading-relaxed font-medium">
                                    You can check the product in front of the delivery man.
                                </p>
                                <p className="text-amber-800 leading-relaxed mt-2">
                                    If you are unsatisfied with the product for any reason, you can return it <strong className="font-bold">right there</strong> to the delivery person.
                                </p>
                            </div>
                        </section>

                        {/* No Refund Policy */}
                        <section>
                            <h2 className="flex items-center text-xl font-semibold text-primary mb-4">
                                <Ban className="mr-3 text-red-500" size={24} />
                                No Return/Refund After Acceptance
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                Once you have accepted the product and the delivery person leaves, the item is considered sold.
                            </p>
                            <div className="mt-3 p-4 bg-red-50 rounded border-l-4 border-red-500">
                                <p className="text-red-700 text-sm">
                                    We do <strong>NOT</strong> accept returns or offer refunds if you change your mind ("mood change") after receiving the product.
                                </p>
                            </div>
                        </section>

                        {/* Rupedia Responsibility */}
                        <section>
                            <h2 className="flex items-center text-xl font-semibold text-primary mb-4">
                                <ShieldCheck className="mr-3 text-green-600" size={24} />
                                Our Responsibility
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                If <strong>Rupedia</strong> makes a mistake (e.g., sending the wrong size, color, or a damaged item), we take full responsibility.
                            </p>
                            <ul className="list-disc list-inside text-slate-600 mt-2 ml-1">
                                <li>We will refund your full amount.</li>
                                <li>OR, we will resend the correct product at <strong>no extra cost</strong> to you.</li>
                            </ul>
                        </section>

                        {/* Divider */}
                        <div className="border-t border-slate-100"></div>

                        {/* Order Cancellation */}
                        <section>
                            <h2 className="flex items-center text-xl font-semibold text-primary mb-4">
                                <Clock className="mr-3" size={24} />
                                Order Cancellation
                            </h2>
                            <div className="space-y-3 text-slate-600 leading-relaxed">
                                <p>
                                    <strong>Standard Orders:</strong> You may cancel within <strong className="font-bold text-slate-800">48 hours</strong> of order confirmation.
                                </p>
                                <p>
                                    <strong>Custom Orders:</strong> Must be cancelled within <strong className="font-bold text-teal-700">24 hours</strong> of confirmation as production begins immediately.
                                </p>
                                <p>
                                    After these periods, the order may be processed for shipping or production and cannot be cancelled.
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnsExchangesPage;
