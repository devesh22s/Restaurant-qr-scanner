import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { setSearchQuery } from "../redux/menuSlice";


import {
  UtensilsCrossed,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ShoppingCart,
  Search,
  MenuIcon,
  ClipboardList,
} from "lucide-react";
import Footer from "./Footer";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const AuthenticatedLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { name, email, role } = useSelector((state) => state.auth);
  // Guest State (Session Token check)
  const isGuest = !localStorage.getItem('accessToken');

  const searchQuery = useSelector((state) => state.menu.searchQuery);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || "");

  const isAdmin = role === "admin" || localStorage.getItem("role") === "admin";

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    dispatch(setSearchQuery(value));
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const { items = [] } = useSelector((state) => state.cart || {});
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
  

  return (
    <>
      {/* GLOBAL THEME STYLES */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Manrope:wght@300;400;500;600&display=swap');
          .font-cinzel { font-family: 'Cinzel', serif; }
          .font-manrope { font-family: 'Manrope', sans-serif; }
          .gold-text-gradient { background: linear-gradient(to right, #FDE68A, #D4AF37, #FDE68A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        `}
      </style>

      {/* Main Container: Deep Black with Gold Selection */}
      <div className="min-h-screen bg-[#020202] flex flex-col font-manrope selection:bg-yellow-500/30 selection:text-yellow-100 relative">
        {/* Background Ambient Glow (Optional visual enhancement) */}
        <div className="fixed top-0 left-0 w-full h-20 bg-gradient-to-b from-yellow-900/10 to-transparent pointer-events-none z-0"></div>

        <header className="bg-black/80 border-b border-yellow-600/20 sticky top-0 z-40 backdrop-blur-md shadow-[0_4px_30px_-10px_rgba(212,175,55,0.1)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* LOGO SECTION */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-black border border-yellow-600/40 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-yellow-500 transition-colors duration-300">
                  <UtensilsCrossed className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold gold-text-gradient font-cinzel tracking-wide">
                    SavoryBites
                  </h2>
                  <p className="text-[9px] text-yellow-600/70 uppercase tracking-[0.2em] font-medium">
                    Restaurant Management
                  </p>
                </div>
              </div>

              {/* SEARCH BAR (Desktop) */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-600/70 group-focus-within:text-yellow-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={localSearchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-yellow-600/20 rounded-lg text-yellow-50 placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 transition-all shadow-inner"
                  />
                  {localSearchQuery && (
                    <button
                      onClick={() => {
                        setLocalSearchQuery("");
                        dispatch(setSearchQuery(""));
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Navbar - only for admin */}
              {isAdmin && (
                <nav className="hidden md:flex items-center gap-8">
                  <Link
                    to="/dashboard"
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-xs uppercase tracking-widest font-semibold relative group"
                  >
                    Dashboard
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-yellow-500 transition-all group-hover:w-full"></span>
                  </Link>
                  <a 
                  
                    href="#"
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-xs uppercase tracking-widest font-semibold relative group"
                  >
                    Menu
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-yellow-500 transition-all group-hover:w-full"></span>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-xs uppercase tracking-widest font-semibold relative group"
                  >
                    Tables    
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-yellow-500 transition-all group-hover:w-full"></span>
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-yellow-400 transition-colors text-xs uppercase tracking-widest font-semibold relative group"
                  >
                    Orders
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-yellow-500 transition-all group-hover:w-full"></span>
                  </a>
                </nav>
              )}

              <div className="flex items-center gap-6">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden text-yellow-500 hover:text-yellow-300 transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>

                {/* Cart Icon */}
                <button
  className="relative p-2 text-yellow-600 hover:text-yellow-400 transition-transform hover:scale-105 active:scale-95"
  aria-label="Shopping cart"
  onClick={() => navigate("/cart")}
>
  <ShoppingCart className="w-6 h-6 stroke-[1.5]" />

  {cartItemCount > 0 && (
    <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg border border-black">
      {cartItemCount}
    </span>
  )}
</button>


                {/* Profile Dropdown (Desktop) */}
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                      isProfileOpen
                        ? "bg-yellow-900/10 border-yellow-500/50"
                        : "bg-transparent border-transparent hover:border-yellow-600/30"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-700 to-yellow-900 p-[1px]">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <User className="w-4 h-4 text-yellow-500" />
                      </div>
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-semibold text-yellow-100 tracking-wide">
                        {name || "User"}
                      </p>
                      <p className="text-[9px] text-yellow-600/80 uppercase tracking-wider">
                        {role || "Guest"}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-3 h-3 text-yellow-600 transition-transform duration-300 ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileOpen(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-64 bg-[#0a0a0a] border border-yellow-600/30 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.9)] backdrop-blur-xl z-20 overflow-hidden animation-fade-in-down">
                        <div className="p-5 border-b border-white/5 bg-gradient-to-r from-yellow-900/10 to-transparent">
                          <p className="text-sm font-cinzel font-bold text-yellow-100">
                            {name || "User"}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {email || "No email"}
                          </p>
                          <span className="inline-block mt-2 px-2 py-0.5 rounded bg-yellow-900/20 border border-yellow-600/20 text-[9px] text-yellow-500 uppercase tracking-widest font-bold">
                            {role || "Guest"}
                          </span>
                        </div>

                        <div className="p-2">
                          {isGuest && (
                             <Link to="/login" className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-yellow-400 hover:bg-white/5 rounded-lg mb-1">
                                <User className="w-4 h-4" /> Sign In / Register
                             </Link>
                          )}
                          {!isGuest && (
  <Link to="/orders" className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-gray-300 hover:bg-white/5 rounded-lg">
    <ClipboardList className="w-4 h-4" /> My Orders
  </Link>
)}
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-900/10 rounded-lg">
                             <LogOut className="w-4 h-4" /> {isGuest ? "Exit Session" : "Logout"}
                          </button>
                       </div>
                       
                        <div className="p-2 space-y-1">
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-gray-300 hover:text-yellow-200 hover:bg-white/5 rounded-lg transition-all"
                          >
                            <User className="w-4 h-4 text-yellow-600" />
                            <span>Profile Settings</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {localStorage.getItem('guestMode')&&<div><Link to = '/register'>Be a member</Link></div>}
              </div>
            </div>
          </div>

          {/* MOBILE MENU DROPDOWN */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-yellow-600/20 bg-[#050505]/95 backdrop-blur-xl animate-slide-down">
              <div className="px-4 py-6 space-y-4">
                {/* Search Bar for Mobile */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-600" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={localSearchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-10 py-3 bg-[#0a0a0a] border border-yellow-600/20 rounded-lg text-yellow-50 placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors text-sm"
                  />
                  {localSearchQuery && (
                    <button
                      onClick={() => {
                        setLocalSearchQuery("");
                        dispatch(setSearchQuery(""));
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Admin only nav items */}
                {isAdmin && (
                  <div className="space-y-1">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-3 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-colors text-sm font-medium border-l-2 border-transparent hover:border-yellow-500"
                    >
                      Dashboard
                    </Link>
                    <a
                      href="#"
                      className="block px-4 py-3 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-colors text-sm font-medium border-l-2 border-transparent hover:border-yellow-500"
                    >
                      Menu
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-3 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-colors text-sm font-medium border-l-2 border-transparent hover:border-yellow-500"
                    >
                      Tables
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-3 text-gray-400 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-colors text-sm font-medium border-l-2 border-transparent hover:border-yellow-500"
                    >
                      Orders
                    </a>
                  </div>
                )}

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    // TODO: Navigate to cart or open cart sidebar
                    navigate('/cart');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-yellow-100 bg-yellow-900/20 border border-yellow-600/20 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold">View Cart (0)</span>
                </button>

                <div className="pt-4 border-t border-white/10">
                  <div className="px-2 py-2 mb-3">
                    <p className="text-sm font-cinzel font-bold text-white">
                      {name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {email || "No email"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 bg-red-900/10 border border-red-900/20 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full relative z-0">
          {children || <Outlet />}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AuthenticatedLayout;
