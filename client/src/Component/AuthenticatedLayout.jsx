import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { setSearchQuery } from "../redux/menuSlice";
import {
  UtensilsCrossed, User, LogOut, Menu, X, ChevronDown, 
  ShoppingCart, Search, ClipboardList, Loader2
} from "lucide-react";
import Footer from "./Footer";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const AuthenticatedLayout = ({ children }) => {
  // 1. HOOKS (Always at the top)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  // --- AUTH STATE ---
  const { user, role } = useSelector((state) => state.auth);
  
  // LocalStorage Fallback (For Refresh Persistence)
  const storedRole = localStorage.getItem("role");
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const currentRole = role || storedRole;
  const currentUserName = user?.name || storedUser?.name || "User";
  const currentUserEmail = user?.email || storedUser?.email || "";
  const isGuest = !localStorage.getItem('accessToken');
  const isAdmin = currentRole === "admin";

  // --- UI STATE (Moved Up - Fixed Error) ---
  const searchQuery = useSelector((state) => state.menu.searchQuery);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || "");

  // --- CART STATE (Moved Up) ---
  const { items = [] } = useSelector((state) => state.cart || {});
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  // --- EFFECTS ---
  // Auto Redirect Admin
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  // --- HANDLERS ---
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    dispatch(setSearchQuery(value));
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear(); // Clear all storage
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // 2. CONDITIONAL RENDER (Hooks ke baad)
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center gap-4 text-yellow-500">
         <Loader2 className="w-10 h-10 animate-spin" />
         <p className="font-cinzel text-lg">Redirecting to Dashboard...</p>
      </div>
    );
  }

  // 3. MAIN RENDER (Customer UI)
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Manrope:wght@300;400;500;600&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
        .gold-text-gradient { background: linear-gradient(to right, #FDE68A, #D4AF37, #FDE68A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
      `}</style>

      <div className="min-h-screen bg-[#020202] flex flex-col font-manrope selection:bg-yellow-500/30 selection:text-yellow-100 relative">
        
        {/* Background Gradient Mesh */}
        <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-900/10 to-transparent pointer-events-none z-0"></div>

        {/* --- HEADER --- */}
        <header className="bg-black/80 border-b border-yellow-600/20 sticky top-0 z-50 backdrop-blur-xl shadow-[0_4px_30px_-10px_rgba(212,175,55,0.1)] transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              
              {/* LOGO */}
              <div onClick={() => navigate('/')} className="flex items-center gap-3 group cursor-pointer z-50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-black border border-yellow-600/40 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:border-yellow-500 transition-colors duration-300">
                  <UtensilsCrossed className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold gold-text-gradient font-cinzel tracking-wide">SavoryBites</h2>
                  <p className="hidden sm:block text-[9px] text-yellow-600/70 uppercase tracking-[0.2em] font-medium">Restaurant Management</p>
                </div>
              </div>

              {/* SEARCH BAR (Desktop) */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-600/70 group-focus-within:text-yellow-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={localSearchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-yellow-600/20 rounded-lg text-yellow-50 placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-all shadow-inner text-gray-200 text-sm"
                  />
                  {localSearchQuery && (
                    <button onClick={() => { setLocalSearchQuery(""); dispatch(setSearchQuery("")); }} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-yellow-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex items-center gap-4 sm:gap-6">
                
                {/* Cart Icon */}
                <button className="relative p-2 text-yellow-600 hover:text-yellow-400 transition-transform hover:scale-105 active:scale-95" onClick={() => navigate("/cart")}>
                  <ShoppingCart className="w-6 h-6 stroke-[1.5]" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-lg border border-black">{cartItemCount}</span>
                  )}
                </button>

                {/* Mobile Menu Toggle */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                  className="md:hidden text-yellow-500 hover:text-yellow-300 transition-colors p-1"
                >
                  {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>

                {/* Desktop Profile Dropdown */}
                <div className="hidden md:block relative">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={`flex items-center gap-3 px-3 py-1.5 rounded-full border transition-all duration-300 ${isProfileOpen ? "bg-yellow-900/10 border-yellow-500/50" : "bg-transparent border-transparent hover:border-yellow-600/30"}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-700 to-yellow-900 p-[1px]">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center"><User className="w-4 h-4 text-yellow-500" /></div>
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-semibold text-yellow-100 tracking-wide">{currentUserName}</p>
                      <p className="text-[9px] text-yellow-600/80 uppercase tracking-wider">{currentRole || "Guest"}</p>
                    </div>
                    <ChevronDown className={`w-3 h-3 text-yellow-600 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                      <div className="absolute right-0 mt-3 w-64 bg-[#0a0a0a] border border-yellow-600/30 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.9)] backdrop-blur-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-5 border-b border-white/5 bg-gradient-to-r from-yellow-900/10 to-transparent">
                          <p className="text-sm font-cinzel font-bold text-yellow-100">{currentUserName}</p>
                          <p className="text-xs text-gray-500 mt-1 truncate">{currentUserEmail}</p>
                        </div>
                        <div className="p-2 space-y-1">
                          {isGuest ? (
                            <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-yellow-400 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setIsProfileOpen(false)}>
                              <User className="w-4 h-4" /> Sign In / Register
                            </Link>
                          ) : (
                            <Link to="/orders" className="flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-gray-300 hover:bg-white/5 rounded-lg transition-colors" onClick={() => setIsProfileOpen(false)}>
                              <ClipboardList className="w-4 h-4 text-yellow-500" /> My Orders
                            </Link>
                          )}
                          <button onClick={() => { setIsProfileOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-red-400 hover:bg-red-900/10 rounded-lg transition-colors">
                            <LogOut className="w-4 h-4" /> {isGuest ? "Exit Session" : "Logout"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* --- MOBILE MENU --- */}
          <div className={`md:hidden absolute top-20 left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-b border-yellow-600/20 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="px-4 py-6 space-y-5">
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-600" />
                <input 
                  type="text" 
                  placeholder="Search menu..." 
                  value={localSearchQuery} 
                  onChange={handleSearchChange} 
                  className="w-full pl-10 pr-10 py-3 bg-[#0a0a0a] border border-yellow-600/20 rounded-lg text-sm text-gray-200 focus:border-yellow-500/50 outline-none" 
                />
              </div>

              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-white/5 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-yellow-900/20 flex items-center justify-center text-yellow-500">
                    <User className="w-5 h-5" />
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-sm font-bold text-white truncate">{currentUserName}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUserEmail}</p>
                 </div>
              </div>

              <div className="space-y-2">
                {!isGuest ? (
                   <Link to="/orders" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-white/5 rounded-lg border border-transparent hover:border-yellow-600/20 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                      <ClipboardList className="w-5 h-5 text-yellow-500" /> 
                      <span className="font-medium">My Orders</span>
                   </Link>
                ) : (
                   <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-yellow-400 hover:bg-white/5 rounded-lg border border-transparent hover:border-yellow-600/20 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="w-5 h-5" /> 
                      <span className="font-medium">Login / Register</span>
                   </Link>
                )}

                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 bg-red-900/10 border border-red-900/20 rounded-lg hover:bg-red-900/20 transition-colors">
                   <LogOut className="w-5 h-5" /> 
                   <span className="font-medium">{isGuest ? "End Session" : "Logout"}</span>
                </button>
              </div>

            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full relative z-0">
          {children || <Outlet />}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AuthenticatedLayout;