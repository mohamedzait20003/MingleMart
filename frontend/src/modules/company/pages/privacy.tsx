import { type FC } from 'react';

const Privacy: FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-xl text-blue-100">Last updated: January 2, 2026</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
                    <div className="prose prose-lg max-w-none">
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                            <p className="text-gray-600 mb-4">
                                At ZCommerce, we are committed to protecting your privacy and ensuring the security of your
                                personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard
                                your information when you use our platform.
                            </p>
                            <p className="text-gray-600 mb-4">
                                By using ZCommerce, you consent to the data practices described in this policy. If you do not
                                agree with our policies and practices, please do not use our services.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                            
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
                            <p className="text-gray-600 mb-4">We collect information that you provide directly to us, including:</p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                                <li>Name, email address, and contact information</li>
                                <li>Billing and shipping addresses</li>
                                <li>Payment information (processed securely through third-party payment processors)</li>
                                <li>Account credentials</li>
                                <li>Purchase history and preferences</li>
                                <li>Communication preferences</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
                            <p className="text-gray-600 mb-4">When you access our platform, we automatically collect:</p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>IP address and device information</li>
                                <li>Browser type and version</li>
                                <li>Operating system</li>
                                <li>Pages visited and time spent on pages</li>
                                <li>Referring website addresses</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                            <p className="text-gray-600 mb-4">We use the information we collect to:</p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Process and fulfill your orders</li>
                                <li>Provide customer support and respond to inquiries</li>
                                <li>Send transactional emails (order confirmations, shipping notifications)</li>
                                <li>Improve our platform and user experience</li>
                                <li>Personalize content and product recommendations</li>
                                <li>Detect and prevent fraud and security threats</li>
                                <li>Comply with legal obligations</li>
                                <li>Send marketing communications (with your consent)</li>
                                <li>Analyze usage patterns and trends</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
                            <p className="text-gray-600 mb-4">
                                We do not sell, trade, or rent your personal information to third parties. We may share your
                                information in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (payment processing, shipping, analytics)</li>
                                <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                                <li><strong>Protection:</strong> To protect the rights, property, and safety of ZCommerce, our users, and others</li>
                                <li><strong>With Consent:</strong> When you give us explicit permission to share your information</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
                            <p className="text-gray-600 mb-4">
                                We use cookies, web beacons, and similar tracking technologies to enhance your browsing
                                experience, analyze site traffic, and understand user behavior.
                            </p>
                            <p className="text-gray-600 mb-4">
                                You can control cookies through your browser settings. However, disabling cookies may limit
                                your ability to use certain features of our platform.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
                            <p className="text-gray-600 mb-4">
                                We implement industry-standard security measures to protect your personal information,
                                including:
                            </p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>SSL/TLS encryption for data transmission</li>
                                <li>Secure servers and databases</li>
                                <li>Regular security audits and updates</li>
                                <li>Access controls and authentication</li>
                                <li>Employee training on data protection</li>
                            </ul>
                            <p className="text-gray-600 mb-4 mt-4">
                                However, no method of transmission over the internet or electronic storage is 100% secure.
                                We cannot guarantee absolute security of your information.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>
                            <p className="text-gray-600 mb-4">You have the right to:</p>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                                <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
                                <li><strong>Object:</strong> Object to the processing of your personal information</li>
                            </ul>
                            <p className="text-gray-600 mb-4 mt-4">
                                To exercise these rights, please contact us at privacy@zcommerce.com.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
                            <p className="text-gray-600 mb-4">
                                ZCommerce is not intended for children under 13 years of age. We do not knowingly collect
                                personal information from children under 13. If you believe we have collected information
                                from a child under 13, please contact us immediately.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Links</h2>
                            <p className="text-gray-600 mb-4">
                                Our platform may contain links to third-party websites. We are not responsible for the
                                privacy practices or content of these external sites. We encourage you to review the privacy
                                policies of any third-party sites you visit.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
                            <p className="text-gray-600 mb-4">
                                Your information may be transferred to and processed in countries other than your country
                                of residence. These countries may have different data protection laws. By using our platform,
                                you consent to the transfer of your information to these countries.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
                            <p className="text-gray-600 mb-4">
                                We may update this Privacy Policy from time to time. We will notify you of any material
                                changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                            </p>
                            <p className="text-gray-600 mb-4">
                                Your continued use of ZCommerce after any changes constitutes your acceptance of the updated
                                Privacy Policy.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;