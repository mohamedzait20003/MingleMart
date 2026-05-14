import { type FC, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LocalOffer, Timer, Star, Favorite } from '@mui/icons-material';

const LDeals: FC = () => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 59,
        seconds: 45
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                }
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const flashDeals = [
        {
            id: 1,
            name: '4K Smart TV 55"',
            price: 399.99,
            originalPrice: 799.99,
            discount: 50,
            rating: 4.6,
            reviews: 1234,
            image: 'https://via.placeholder.com/300x300?text=Smart+TV',
            stock: 15,
            sold: 85
        },
        {
            id: 2,
            name: 'Wireless Earbuds Pro',
            price: 79.99,
            originalPrice: 149.99,
            discount: 47,
            rating: 4.8,
            reviews: 3456,
            image: 'https://via.placeholder.com/300x300?text=Earbuds',
            stock: 8,
            sold: 92
        },
        {
            id: 3,
            name: 'Robot Vacuum Cleaner',
            price: 199.99,
            originalPrice: 399.99,
            discount: 50,
            rating: 4.5,
            reviews: 892,
            image: 'https://via.placeholder.com/300x300?text=Robot+Vacuum',
            stock: 23,
            sold: 77
        },
        {
            id: 4,
            name: 'Gaming Laptop',
            price: 899.99,
            originalPrice: 1499.99,
            discount: 40,
            rating: 4.7,
            reviews: 567,
            image: 'https://via.placeholder.com/300x300?text=Gaming+Laptop',
            stock: 5,
            sold: 95
        }
    ];

    const dailyDeals = [
        {
            id: 5,
            name: 'Instant Pot Duo',
            price: 69.99,
            originalPrice: 119.99,
            discount: 42,
            rating: 4.9,
            reviews: 12345,
            image: 'https://via.placeholder.com/300x300?text=Instant+Pot',
        },
        {
            id: 6,
            name: 'Air Fryer XL',
            price: 89.99,
            originalPrice: 159.99,
            discount: 44,
            rating: 4.6,
            reviews: 5432,
            image: 'https://via.placeholder.com/300x300?text=Air+Fryer',
        },
        {
            id: 7,
            name: 'Coffee Maker Deluxe',
            price: 49.99,
            originalPrice: 99.99,
            discount: 50,
            rating: 4.4,
            reviews: 2341,
            image: 'https://via.placeholder.com/300x300?text=Coffee+Maker',
        },
        {
            id: 8,
            name: 'Blender Pro 3000',
            price: 59.99,
            originalPrice: 129.99,
            discount: 54,
            rating: 4.7,
            reviews: 1890,
            image: 'https://via.placeholder.com/300x300?text=Blender',
        },
        {
            id: 9,
            name: 'Electric Kettle',
            price: 29.99,
            originalPrice: 59.99,
            discount: 50,
            rating: 4.5,
            reviews: 3456,
            image: 'https://via.placeholder.com/300x300?text=Kettle',
        },
        {
            id: 10,
            name: 'Stand Mixer',
            price: 149.99,
            originalPrice: 299.99,
            discount: 50,
            rating: 4.8,
            reviews: 987,
            image: 'https://via.placeholder.com/300x300?text=Stand+Mixer',
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-linear-to-r from-red-600 to-orange-500 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center mb-4">
                        <LocalOffer className="text-5xl mr-3" />
                        <h1 className="text-4xl md:text-5xl font-bold">Hot Deals</h1>
                    </div>
                    <p className="text-xl md:text-2xl text-red-100 mb-6">
                        Save up to 70% on selected items • Limited time only!
                    </p>
                    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-lg px-8 py-4">
                        <div className="flex items-center space-x-2 text-sm mb-2">
                            <Timer className="text-yellow-300" />
                            <span className="text-yellow-300 font-semibold">Deal ends in:</span>
                        </div>
                        <div className="flex space-x-4 text-3xl font-bold">
                            <div className="bg-white/30 rounded-lg px-4 py-2">
                                <div>{String(timeLeft.hours).padStart(2, '0')}</div>
                                <div className="text-xs font-normal">Hours</div>
                            </div>
                            <div className="text-4xl self-center">:</div>
                            <div className="bg-white/30 rounded-lg px-4 py-2">
                                <div>{String(timeLeft.minutes).padStart(2, '0')}</div>
                                <div className="text-xs font-normal">Minutes</div>
                            </div>
                            <div className="text-4xl self-center">:</div>
                            <div className="bg-white/30 rounded-lg px-4 py-2">
                                <div>{String(timeLeft.seconds).padStart(2, '0')}</div>
                                <div className="text-xs font-normal">Seconds</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Flash Deals */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">⚡ Flash Deals</h2>
                            <p className="text-gray-600">Hurry! Limited stock available</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {flashDeals.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group relative">
                                <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                                    -{product.discount}%
                                </div>
                                <div className="absolute top-2 right-2 z-10">
                                    <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition">
                                        <Favorite className="w-5 h-5 text-gray-400 hover:text-red-500" />
                                    </button>
                                </div>
                                <div className="relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                                    />
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
                                        <span className="text-2xl font-bold text-red-600">${product.price}</span>
                                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                                    </div>
                                    
                                    {/* Stock Progress Bar */}
                                    <div className="mb-3">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Sold: {product.sold}%</span>
                                            <span>Only {product.stock} left!</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-linear-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all"
                                                style={{ width: `${product.sold}%` }}
                                            />
                                        </div>
                                    </div>

                                    <button className="w-full bg-linear-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-2 rounded-lg font-medium transition">
                                        Grab Deal Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Daily Deals */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Today's Best Deals</h2>
                            <p className="text-gray-600">Handpicked deals updated daily</p>
                        </div>
                        <Link to="/home/shop" className="text-blue-600 hover:text-blue-700 font-medium">
                            View All →
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {dailyDeals.map((product) => (
                            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group">
                                <div className="relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                                        -{product.discount}%
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 h-10">{product.name}</h3>
                                    <div className="flex items-center text-yellow-400 mb-2">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-xs text-gray-700 ml-1">{product.rating}</span>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="text-lg font-bold text-red-600">${product.price}</span>
                                        <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Deal Categories */}
                <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Don't Miss Out!</h2>
                    <p className="text-xl mb-6 text-blue-100">
                        Subscribe to our newsletter and get exclusive deals delivered to your inbox
                    </p>
                    <div className="max-w-md mx-auto flex gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        />
                        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LDeals;