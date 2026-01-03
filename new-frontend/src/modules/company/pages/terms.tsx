import { type FC } from 'react';

const Terms: FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-xl text-blue-100">Last updated: January 2, 2026</p>
                </div>
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-600 mb-4">
                                By accessing and using ZCommerce's website and services, you accept and agree to be bound
                                by the terms and provisions of this agreement. If you do not agree to these Terms of Service,
                                please do not use our platform.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Service</h2>
                            <p className="text-gray-600 mb-4">
                                ZCommerce grants you a limited, non-exclusive, non-transferable license to access and use
                                our platform for personal, non-commercial purposes, subject to these Terms of Service.
                            </p>
                            <p className="text-gray-600 mb-4">You agree not to:</p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Use the service for any illegal or unauthorized purpose</li>
                                <li>Violate any laws in your jurisdiction</li>
                                <li>Infringe on the intellectual property rights of others</li>
                                <li>Transmit any harmful code or malware</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Registration</h2>
                            <p className="text-gray-600 mb-4">
                                To access certain features of ZCommerce, you may be required to create an account. You are
                                responsible for maintaining the confidentiality of your account credentials and for all
                                activities that occur under your account.
                            </p>
                            <p className="text-gray-600 mb-4">
                                You agree to provide accurate, current, and complete information during registration and to
                                update such information to keep it accurate, current, and complete.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Product Information and Pricing</h2>
                            <p className="text-gray-600 mb-4">
                                We strive to provide accurate product descriptions and pricing information. However, we do
                                not warrant that product descriptions, pricing, or other content is accurate, complete,
                                reliable, current, or error-free.
                            </p>
                            <p className="text-gray-600 mb-4">
                                We reserve the right to correct any errors, inaccuracies, or omissions and to change or
                                update information at any time without prior notice. If a product is listed at an incorrect
                                price due to an error, we have the right to refuse or cancel orders placed for that product.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Orders and Payment</h2>
                            <p className="text-gray-600 mb-4">
                                By placing an order through ZCommerce, you agree to provide current, complete, and accurate
                                purchase and account information. All payments are processed securely through our payment
                                partners.
                            </p>
                            <p className="text-gray-600 mb-4">
                                We reserve the right to refuse any order placed through the site. We may, in our sole
                                discretion, limit or cancel quantities purchased per person, per household, or per order.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Shipping and Delivery</h2>
                            <p className="text-gray-600 mb-4">
                                Shipping times and costs vary based on your location and the shipping method selected. We
                                are not responsible for delays caused by shipping carriers or customs processes.
                            </p>
                            <p className="text-gray-600 mb-4">
                                Risk of loss and title for products purchased pass to you upon delivery to the carrier.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Returns and Refunds</h2>
                            <p className="text-gray-600 mb-4">
                                Our return policy allows for returns within 30 days of receipt. Products must be unused
                                and in their original packaging. Certain products may not be eligible for return due to
                                hygiene or safety reasons.
                            </p>
                            <p className="text-gray-600 mb-4">
                                Refunds will be processed to the original payment method within 5-10 business days after
                                we receive the returned item.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
                            <p className="text-gray-600 mb-4">
                                All content on ZCommerce, including text, graphics, logos, images, and software, is the
                                property of ZCommerce or its content suppliers and is protected by copyright and other
                                intellectual property laws.
                            </p>
                            <p className="text-gray-600 mb-4">
                                You may not reproduce, distribute, modify, or create derivative works from any content
                                on our platform without express written permission.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                            <p className="text-gray-600 mb-4">
                                ZCommerce and its affiliates will not be liable for any indirect, incidental, special,
                                consequential, or punitive damages arising from your use of our services, including but
                                not limited to lost profits, data loss, or business interruption.
                            </p>
                            <p className="text-gray-600 mb-4">
                                Our total liability to you for any claim arising from your use of our services shall not
                                exceed the amount you paid us in the past twelve months.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications to Terms</h2>
                            <p className="text-gray-600 mb-4">
                                We reserve the right to modify these Terms of Service at any time. We will notify users
                                of any material changes by posting the new Terms of Service on this page and updating the
                                "Last updated" date.
                            </p>
                            <p className="text-gray-600 mb-4">
                                Your continued use of the platform after any such changes constitutes your acceptance of
                                the new Terms of Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
                            <p className="text-gray-600 mb-4">
                                These Terms of Service shall be governed by and construed in accordance with the laws of
                                the jurisdiction in which ZCommerce operates, without regard to its conflict of law provisions.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;