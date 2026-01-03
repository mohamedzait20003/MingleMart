import { type FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import { CircularProgress } from '@mui/material';
import { ShoppingCart, PersonOutline, Menu, Close, Dashboard, Logout } from '@mui/icons-material';

import type { RootState } from '../store';
import { useLogoutMutation } from '../store/apis/authApi';

const Navbar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [logout, { isLoading }] = useLogoutMutation();
  const { isAuthenticated, role, user } = useSelector((state: RootState) => state.auth);

  console.log('Auth State:', { isAuthenticated, role, user });

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success('Logged out successfully');
      navigate('/home');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/home" className="flex items-center">
            <span className="text-2xl md:text-3xl font-extrabold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex">
              {[..."ZCommerce"].map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    repeatDelay: 2,
                    delay: i * 0.1,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated && (
              <>
                <Link to="/home" className={`font-medium transition-colors duration-300 relative ${location.pathname === '/home' || location.pathname === '/' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                  Home
                  {(location.pathname === '/home' || location.pathname === '/') && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
                <Link to="/home/shop" className={`font-medium transition-colors duration-300 relative ${location.pathname.startsWith('/home/shop') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                  Shop
                  {location.pathname.startsWith('/home/shop') && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
                <Link to="/home/deals" className={`font-medium transition-colors duration-300 relative ${location.pathname.startsWith('/home/deals') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                  Deals
                  {location.pathname.startsWith('/home/deals') && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
                <Link to="/company/about" className={`font-medium transition-colors duration-300 relative ${location.pathname.startsWith('/company/about') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                  About
                  {location.pathname.startsWith('/company/about') && (
                    <motion.div
                      layoutId="activeNavUnderline"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </>
            )}

            {isAuthenticated && role === 'Customer' && (
              <>
                <Link to="/shop" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Shop
                </Link>
                <Link to="/shop/categories" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Categories
                </Link>
                <Link to="/deals" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Deals
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  My Orders
                </Link>
              </>
            )}

            {isAuthenticated && role === 'admin' && (
              <>
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Dashboard
                </Link>
                <Link to="/admin/products" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Products
                </Link>
                <Link to="/admin/orders" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Orders
                </Link>
                <Link to="/admin/users" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Users
                </Link>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {role === 'Customer' && (
                  <>
                    <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition">
                      <ShoppingCart className="w-6 h-6" />
                      {/* {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )} */}
                    </Link>
                  </>
                )}

                {/* Admin-specific icons */}
                {role === 'admin' && (
                  <Link to="/admin/dashboard" className="hidden md:block text-gray-700 hover:text-blue-600 transition">
                    <Dashboard className="w-6 h-6" />
                  </Link>
                )}

                {/* User menu dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition">
                    <PersonOutline className="w-6 h-6" />
                    <span className="hidden md:block text-sm font-medium">
                      {user?.username || 'Account'}
                    </span>
                  </button>
                  
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to={role === 'admin' ? '/admin/profile' : '/profile'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    {role === 'Customer' && (
                      <>
                        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Orders
                        </Link>
                        <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Wishlist
                        </Link>
                      </>
                    )}
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Logout className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Show for unauthenticated users */
              <>
                <Link
                  to="/authenticate/login"
                  className="hidden md:block text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/authenticate/sign-up"
                  className="hidden md:block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <Close className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar removed for customer */}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            {!isAuthenticated && (
              <>
                <Link
                  to="/home"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/home/shop"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  to="/home/deals"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Deals
                </Link>
                <Link
                  to="/company/about"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <hr className="my-2" />
                <Link
                  to="/authenticate/login"
                  className="block text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/authenticate/sign-up"
                  className="block text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}

            {isAuthenticated && role === 'Customer' && (
              <>
                <Link
                  to="/shop"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  to="/shop/categories"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  to="/deals"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Deals
                </Link>
                <Link
                  to="/orders"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/cart"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {/* Cart {cartCount > 0 && `(${cartCount})`} */}
                </Link>
                <hr className="my-2" />
                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-700 font-medium"
                >
                  {isLoading ? <CircularProgress size={16} /> : 'Logout'}
                </button>
              </>
            )}

            {isAuthenticated && role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/admin/orders"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/admin/users"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Users
                </Link>
                <hr className="my-2" />
                <Link
                  to="/admin/profile"
                  className="block text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-700 font-medium"
                >
                  {isLoading ? <CircularProgress size={16} /> : 'Logout'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar