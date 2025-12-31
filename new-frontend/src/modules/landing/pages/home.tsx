import { type FC } from 'react';
import { Link } from 'react-router-dom';

import { LocalShipping, Security, HeadsetMic, ArrowForward, Star as StarIcon } from '@mui/icons-material';

const LHome: FC = () => {
  return (
    <div className="bg-white">
      <section className="relative bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="md:w-2/3 lg:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing Deals Every Day
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Shop from thousands of products with free shipping and hassle-free returns. Your perfect find is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
              >
                Shop Now
                <ArrowForward className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/deals"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition"
              >
                View Deals
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                <LocalShipping className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $50. Fast and reliable delivery to your doorstep.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                <Security className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure transactions with multiple payment options.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                <HeadsetMic className="w-8 h-8" />
                              <ArrowForward className="ml-2 w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our team is here to help you anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Electronics', color: 'bg-blue-500' },
              { name: 'Fashion', color: 'bg-pink-500' },
              { name: 'Home & Garden', color: 'bg-green-500' },
              { name: 'Sports', color: 'bg-orange-500' },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/shop/${category.name.toLowerCase().replace(' & ', '-')}`}
                className="group"
              >
                <div className={`${category.color} rounded-lg aspect-square flex items-center justify-center text-white text-xl font-semibold mb-2 group-hover:scale-105 transition`}>
                  {category.name}
                </div>
                <p className="text-center text-gray-700 group-hover:text-blue-600 transition">
                  Explore {category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Trending Products</h2>
            <Link to="/shop" className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
              View All
              <ArrowForward className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition group">
                <div className="bg-gray-200 aspect-square flex items-center justify-center text-gray-400 group-hover:bg-gray-300 transition">
                  Product Image
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">(128)</span>
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition">
                    Premium Product Name
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">$99.99</span>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-linear-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Sign up today and get 15% off your first order!
          </p>
          <Link
            to="/authenticate/sign-up"
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
          >
            Create Account
            <ArrowForward className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LHome;
