import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { setSearchQuery } from '../redux/menuSlice';
import { UtensilsCrossed, User, LogOut, Menu, X, ChevronDown, ShoppingCart, Search } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Footer from './Footer';

const AuthenticatedLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { name, email, role } = useSelector((state) => state.auth);
  const searchQuery = useSelector((state) => state.menu.searchQuery);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');

  const isAdmin = role === 'admin' || localStorage.getItem('role') === 'admin';

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    dispatch(setSearchQuery(value));
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
    
      <header className="bg-gray-900/50 border-b border-gray-800 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-gray-200" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">SavoryBites</h2>
                <p className="text-[9px] text-gray-400 uppercase tracking-wider">Restaurant Management</p>
              </div>
            </div>

         
       
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-gray-600 transition-colors"
                />
                {localSearchQuery && (
                  <button
                    onClick={() => {
                      setLocalSearchQuery('');
                      dispatch(setSearchQuery(''));
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Navbar - only for admin */}
            {isAdmin && (
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Dashboard
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Menu
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Tables
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Orders
                </a>
              </nav>
            )}

         
            <div className="flex items-center gap-4">
         
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-300 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

          
              <button
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Shopping cart"
                onClick={() => {
                  // TODO: Navigate to cart or open cart sidebar
                  console.log('Cart clicked');
                }}
              >
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>

       
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-white">{name || 'User'}</p>
                    <p className="text-[10px] text-gray-400">{role || 'Guest'}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

         
                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-gray-900/95 border border-gray-800 rounded-lg shadow-lg backdrop-blur-sm z-20">
                      <div className="p-4 border-b border-gray-800">
                        <p className="text-sm font-semibold text-white">{name || 'User'}</p>
                        <p className="text-xs text-gray-400 mt-1">{email || 'No email'}</p>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase">{role || 'Guest'}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);  
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800/50 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile Settings</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-2">
              {/* Search Bar for Mobile */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={localSearchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-10 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-gray-600 transition-colors"
                />
                {localSearchQuery && (
                  <button
                    onClick={() => {
                      setLocalSearchQuery('');
                      dispatch(setSearchQuery(''));
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Admin only nav items */}
              {isAdmin && (
                <>
                  <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                    Dashboard
                  </a>
                  <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                    Menu
                  </a>
                  <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                    Tables
                  </a>
                  <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                    Orders
                  </a>
                </>
              )}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  // TODO: Navigate to cart or open cart sidebar
                  console.log('Cart clicked');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart (0)</span>
              </button>
              <div className="pt-4 border-t border-gray-800">
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-semibold text-white">{name || 'User'}</p>
                  <p className="text-xs text-gray-400">{email || 'No email'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

     
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {children || <Outlet />}
      </main>

      <Footer />
    </div>
  );
};

export default AuthenticatedLayout;
