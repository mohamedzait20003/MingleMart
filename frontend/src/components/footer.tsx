import { type FC, type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import { CircularProgress } from '@mui/material';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer: FC = () => {
  const [loading, setLoading] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/subs/subscribe`, { email: newsletterEmail }).then(() => {
      toast.success('Subscribed to newsletter successfully!'); 
      setNewsletterEmail('');
    }).catch(() => {
      toast.error('Failed to subscribe. Please try again later.');
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-2">Subscribe to our newsletter</h3>
              <p className="text-sm">Get the latest deals and exclusive offers delivered to your inbox</p>
            </div>
            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white font-bold text-2xl px-3 py-1 rounded">
                Z
              </div>
              <span className="text-xl font-bold text-white">Commerce</span>
            </div>
            <p className="text-sm mb-4">
              Your trusted destination for quality products at unbeatable prices. Shop with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop/electronics" className="hover:text-white transition">Electronics</Link></li>
              <li><Link to="/shop/fashion" className="hover:text-white transition">Fashion</Link></li>
              <li><Link to="/shop/home" className="hover:text-white transition">Home & Garden</Link></li>
              <li><Link to="/shop/sports" className="hover:text-white transition">Sports & Outdoors</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition">Shipping Info</Link></li>
              <li><Link to="/returns" className="hover:text-white transition">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/company/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/company/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="/company/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/company/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <p className="text-sm text-center md:text-left">
              © 2025 ZCommerce. All rights reserved.
            </p>
            <div className="flex items-center justify-center md:justify-end space-x-4 mt-4 md:mt-0">
              <span className="text-xs">We accept:</span>
              <div className="flex space-x-2 text-xs">
                <span className="bg-gray-800 px-2 py-1 rounded">VISA</span>
                <span className="bg-gray-800 px-2 py-1 rounded">MC</span>
                <span className="bg-gray-800 px-2 py-1 rounded">AMEX</span>
                <span className="bg-gray-800 px-2 py-1 rounded">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
