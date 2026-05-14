import { type FC, useState } from 'react';
import { Link } from 'react-router-dom';

import { Search, FilterList, Star } from '@mui/icons-material';

const LShop: FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { name: 'Electronics', icon: '💻', count: 1234 },
        { name: 'Fashion', icon: '👔', count: 3456 },
        { name: 'Home & Garden', icon: '🏡', count: 892 },
        { name: 'Sports & Outdoors', icon: '⚽', count: 567 },
        { name: 'Books & Media', icon: '📚', count: 2341 },
        { name: 'Toys & Games', icon: '🎮', count: 789 },
        { name: 'Health & Beauty', icon: '💄', count: 1456 },
        { name: 'Automotive', icon: '🚗', count: 432 }
    ];

    const featuredProducts = [
        {
            id: 1,
            name: 'Wireless Headphones',
            price: 89.99,
            originalPrice: 129.99,
            rating: 4.5,
            reviews: 234,
            image: 'https://via.placeholder.com/300x300?text=Headphones',
            badge: 'Best Seller'
        },
        {
            id: 2,
            name: 'Smart Watch',
            price: 199.99,
            originalPrice: 299.99,
            rating: 4.8,
            reviews: 567,
            image: 'https://via.placeholder.com/300x300?text=Smart+Watch',
            badge: 'New Arrival'
        },
        {
            id: 3,
            name: 'Laptop Backpack',
            price: 49.99,
            originalPrice: 79.99,
            rating: 4.3,
            reviews: 123,
            image: 'https://via.placeholder.com/300x300?text=Backpack',
            badge: 'Sale'
        },
        {
            id: 4,
            name: 'Gaming Mouse',
            price: 59.99,
            originalPrice: 89.99,
            rating: 4.7,
            reviews: 890,
            image: 'https://via.placeholder.com/300x300?text=Gaming+Mouse',
            badge: 'Popular'
        },
        {
            id: 5,
            name: 'Mechanical Keyboard',
            price: 129.99,
            originalPrice: 179.99,
            rating: 4.6,
            reviews: 456,
            image: 'https://via.placeholder.com/300x300?text=Keyboard',
            badge: 'Best Seller'
        },
        {
            id: 6,
            name: 'Portable Speaker',
            price: 39.99,
            originalPrice: 69.99,
            rating: 4.4,
            reviews: 234,
            image: 'https://via.placeholder.com/300x300?text=Speaker',
            badge: 'Sale'
        },
        {
            id: 7,
            name: 'Fitness Tracker',
            price: 79.99,
            originalPrice: 119.99,
            rating: 4.5,
            reviews: 678,
            image: 'https://via.placeholder.com/300x300?text=Fitness+Tracker',
            badge: 'New'
        },
        {
            id: 8,
            name: 'Wireless Charger',
            price: 29.99,
            originalPrice: 49.99,
            rating: 4.2,
            reviews: 345,
            image: 'https://via.placeholder.com/300x300?text=Charger',
            badge: 'Popular'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop All Products</h1>
                    <p className="text-xl text-blue-100 mb-8">Discover thousands of products at unbeatable prices</p>
                    
                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <div className="relative shadow-2xl">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-4 pr-32 rounded-xl text-gray-900 text-lg placeholder:text-gray-400 border-2 border-transparent focus:outline-none focus:border-white focus:ring-4 focus:ring-white/20 transition-all duration-300"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2">
                                <Search className="w-5 h-5" />
                                <span>Search</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                        <FilterList />
                        <span>Filters</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-12">
                    {categories.map((category, index) => (
                        <Link
                            key={index}
                            to={`/shop/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
                        >
                            <div className="text-4xl mb-3">{category.icon}</div>
                            <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                            <p className="text-sm text-gray-500">{category.count} items</p>
                        </Link>
                    ))}
                </div>

                {/* Featured Products */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group">
                                <div className="relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        {product.badge}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                                    <div className="flex items-center mb-2">
                                        <div className="flex items-center text-yellow-400">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="text-sm text-gray-700 ml-1">{product.rating}</span>
                                        </div>
                                        <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                                    </div>
                                    <div className="flex items-center space-x-2 mb-3">
                                        <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                                    </div>
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Why Shop With Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl mb-3">🚚</div>
                            <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
                            <p className="text-gray-600">On orders over $50</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">🔒</div>
                            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                            <p className="text-gray-600">100% secure transactions</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">↩️</div>
                            <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
                            <p className="text-gray-600">30-day return policy</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LShop;