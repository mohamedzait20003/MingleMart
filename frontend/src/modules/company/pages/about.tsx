import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { Store, LocalShipping, Security, Support } from '@mui/icons-material';

const About: FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About ZCommerce</h1>
                    <p className="text-xl md:text-2xl text-blue-100">Your trusted e-commerce destination since 2024</p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        At ZCommerce, we're committed to providing an exceptional online shopping experience by offering
                        quality products, competitive prices, and outstanding customer service. We believe in making
                        e-commerce accessible, secure, and enjoyable for everyone.
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Store className="text-blue-600 text-3xl" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
                        <p className="text-gray-600">Carefully curated selection of premium products</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LocalShipping className="text-purple-600 text-3xl" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
                        <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Security className="text-green-600 text-3xl" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
                        <p className="text-gray-600">Advanced security measures to protect your data</p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Support className="text-orange-600 text-3xl" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                        <p className="text-gray-600">Always here to help with your questions</p>
                    </div>
                </div>

                {/* Story Section */}
                <div className="bg-white rounded-lg shadow-md p-8 md:p-12 mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                    <div className="prose prose-lg max-w-none text-gray-600">
                        <p className="mb-4">
                            Founded in 2024, ZCommerce began with a simple vision: to create an online marketplace that
                            combines the best selection of products with an unparalleled shopping experience. What started
                            as a small operation has grown into a trusted platform serving thousands of customers worldwide.
                        </p>
                        <p className="mb-4">
                            We understand that online shopping should be convenient, secure, and enjoyable. That's why we've
                            invested heavily in technology, security, and customer service to ensure every transaction meets
                            the highest standards.
                        </p>
                        <p>
                            Today, ZCommerce continues to grow and evolve, always with our customers at the heart of
                            everything we do. We're not just building a marketplace – we're building lasting relationships
                            based on trust, quality, and exceptional service.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
                        <div className="text-gray-600">Happy Customers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600 mb-2">100K+</div>
                        <div className="text-gray-600">Products Sold</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
                        <div className="text-gray-600">Product Range</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                        <div className="text-gray-600">Customer Support</div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-linear-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
                    <p className="text-xl mb-8 text-blue-100">
                        We're always looking for talented individuals to join our growing team
                    </p>
                    <Link
                        to="/company/careers"
                        className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                        View Open Positions
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;