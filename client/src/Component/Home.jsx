import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMenuItems, setSelectedCategory } from '../redux/menuSlice';
import { addedTOCart, getCart } from '../redux/cartSlice';
import { useToast } from '../context/ToastContext';
import Hero from './Hero';
import { ShoppingBag, Star, QrCode, Home as HomeIcon, AlertCircle, ChefHat, SearchX } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';

// --- Premium Loading Skeleton ---
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 mt-8 max-w-7xl mx-auto">
    {[...Array(8)].map((_, index) => (
      <div key={index} className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden relative flex flex-col">
        <div className="aspect-[4/3] w-full bg-white/5 animate-pulse"></div>
        <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
          <div>
            <div className="h-6 w-3/4 bg-white/5 rounded animate-pulse mb-3"></div>
            <div className="h-3 w-full bg-white/5 rounded animate-pulse mb-2"></div>
            <div className="h-3 w-4/5 bg-white/5 rounded animate-pulse"></div>
          </div>
          <div className="pt-4 flex justify-between items-center border-t border-white/5 mt-4">
             <div className="h-6 w-16 bg-white/5 rounded animate-pulse"></div>
             <div className="h-10 w-28 bg-white/5 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  
  // Redux Data
  const { menuItems, categories, loading, error, selectedCategory, searchQuery } = useSelector((state) => state.menu);
  
  const [searchParams] = useSearchParams();
  const tableSlug = searchParams.get('table');

  // Local State for Table
  const [activeTable, setActiveTable] = useState(() => {
    if (tableSlug) return null; 
    return localStorage.getItem('tableNumber');
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(false);

  // Crash-Proof Search Logic
  const filteredItems = menuItems.filter((item) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase().trim();
      const name = item.name ? item.name.toLowerCase() : "";
      const description = item.description ? item.description.toLowerCase() : "";
      const category = item.category ? item.category.toLowerCase() : "";

      return (
          name.includes(query) || 
          description.includes(query) ||
          category.includes(query)
      );
  });

  // Manual Verify Function
  const verifyTable = async () => {
    if (!tableSlug) return;
    setIsVerifying(true);
    setVerificationError(false);

    try {
      const res = await api.get(`/tables/slug/${tableSlug}`);
      if (res.data.success) {
        const tableData = res.data.data;
        localStorage.setItem('tableNumber', tableData.tableNumber);
        localStorage.setItem('tableId', tableData._id);
        setActiveTable(tableData.tableNumber);
        toast.success(`Welcome to Table ${tableData.tableNumber}`);
      }
    } catch (err) {
      console.error("QR Error", err);
      setVerificationError(true);
      localStorage.removeItem('tableNumber');
      setActiveTable(null);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    dispatch(fetchMenuItems(selectedCategory || "All"));
  }, [dispatch, selectedCategory]); 

  const handleCategoryChange = (category) => dispatch(setSelectedCategory(category));

  const handleAddToCart = async (menuItemId) => {
    try {
      await dispatch(addedTOCart({ menuItemId, quantity: 1 })).unwrap();
      toast.success('Added to your feast! 🍲');
      dispatch(getCart()); 
    } catch (error) {
      console.log(error);
      toast.error('Could not add item');
    }
  };

  // UI: Invalid QR
  if (verificationError) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 text-center font-manrope">
        <div className="bg-[#0a0a0a] border border-red-500/20 p-10 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.1)] flex flex-col items-center max-w-md w-full">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-cinzel font-bold text-white mb-2">Invalid Table</h2>
          <p className="text-gray-400 mb-8 text-sm">The scanned QR code is expired or invalid.</p>
          <a href="/" className="w-full bg-white hover:bg-gray-200 text-black px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
            <HomeIcon size={18}/> Return Home
          </a>
        </div>
      </div>
    );
  }

  // UI: Verification Required
  if (tableSlug && !activeTable) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 text-center font-manrope relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-yellow-500/20 p-10 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.05)] flex flex-col items-center max-w-md w-full relative z-10">
          <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 border-2 border-yellow-500/30 rounded-full animate-ping opacity-20"></div>
            <QrCode className="w-12 h-12 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-cinzel font-bold text-white mb-2">Table Detected</h2>
          <p className="text-gray-400 mb-8 text-sm">Please verify your table to access the menu.</p>
          
          <button 
            onClick={verifyTable} 
            disabled={isVerifying} 
            className="w-full group relative py-4 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#291d0a] font-bold rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center transition-transform active:scale-[0.98]"
          >
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out skew-y-12"></div>
             <div className="relative flex items-center gap-2 font-cinzel text-lg">
               {isVerifying ? "Verifying..." : <><ChefHat size={20} /> Enter Restaurant</>}
             </div>
          </button>
        </div>
      </div>
    );
  }

  // 🍽️ MAIN MENU UI
  return (
    <div className="min-h-screen bg-[#020202] font-manrope selection:bg-yellow-500/30 selection:text-yellow-200">
      
      {/* Hide Scrollbar for Horizontal Scroll */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Hero activeTable={activeTable} />

      <div id="menu-section" className="relative space-y-10 pt-16 pb-24">
        
        {/* Header */}
        <div className="text-center space-y-4 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-white drop-shadow-sm tracking-wide">
            Our Signature Menu
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light tracking-wide">
            {searchQuery 
                ? `Searching results for "${searchQuery}"...` 
                : "Curated with passion, crafted for your ultimate culinary delight."}
          </p>
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent mx-auto rounded-full mt-6"></div>
        </div>

        {/* Categories (Horizontally scrollable on mobile) */}
        {!searchQuery && categories.length > 0 && (
          <div className="sticky top-[70px] z-30 py-4 bg-[#020202]/80 backdrop-blur-xl border-y border-white/5 shadow-2xl">
             <div className="flex overflow-x-auto hide-scrollbar gap-3 px-4 max-w-7xl mx-auto md:justify-center md:flex-wrap pb-1 md:pb-0">
                {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`flex-shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                    selectedCategory === category
                        ? 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black border-transparent shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-yellow-500/30 hover:text-yellow-200 hover:bg-white/10'
                    }`}
                >
                    {category}
                </button>
                ))}
             </div>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Error */}
        {error && (
            <div className="text-center py-20 text-red-400 max-w-md mx-auto px-4">
                <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20">
                  <p className="mb-4 text-sm">Unable to load the culinary experience.</p>
                  <button onClick={() => dispatch(fetchMenuItems(selectedCategory))} className="px-6 py-2 border border-red-500/50 text-red-400 rounded-full hover:bg-red-500/20 transition-colors text-xs font-bold tracking-widest uppercase">Try Again</button>
                </div>
            </div>
        )}

        {/* ✅ PREMIUM GRID */}
        {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
                
                {filteredItems.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-500 space-y-6">
                        <div className="bg-white/5 p-6 rounded-full border border-white/5">
                           <SearchX className="w-12 h-12 text-yellow-500/50" />
                        </div>
                        <div className="text-center">
                           <h3 className="text-2xl font-cinzel font-bold text-white mb-2">No items found</h3>
                           <p className="text-gray-400 text-sm">
                              {searchQuery 
                                ? `We couldn't find anything matching "${searchQuery}"` 
                                : "No items available in this category."}
                           </p>
                        </div>
                    </div>
                ) : (
                    filteredItems.map((item) => (
                    <div key={item._id} className="group flex flex-col bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all duration-500 shadow-lg hover:shadow-[0_10px_40px_-15px_rgba(234,179,8,0.15)]">
                        
                        {/* Image Container */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/50">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 opacity-90"></div>
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300/111111/333333?text=Dish'; }}
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                                {!item.isAvailable && (
                                    <div className="bg-red-500/90 backdrop-blur-md text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-lg border border-red-400/20">Sold Out</div>
                                )}
                                <div className="bg-black/50 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                    {item.category}
                                </div>
                            </div>

                            {/* Floating Price Pill */}
                            <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-yellow-500/20 shadow-lg">
                                <span className="text-lg font-cinzel font-bold text-yellow-500">₹{item.price}</span>
                            </div>
                        </div>

                        {/* Content Container (flex-grow ensures equal height) */}
                        <div className="p-5 flex flex-col flex-grow relative">
                            <div className="flex-grow">
                              <h3 className="text-xl font-bold text-white font-cinzel group-hover:text-yellow-500 transition-colors leading-snug mb-2 pr-2">{item.name}</h3>
                              
                              <div className="flex gap-1 mb-3">
                                  {[...Array(5)].map((_, i) => ( <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700 fill-gray-700'}`} /> ))}
                              </div>
                              
                              <p className="text-sm text-gray-400 line-clamp-2 font-light leading-relaxed mb-4">{item.description}</p>
                            </div>
                            
                            {/* Action Button at bottom */}
                            <div className="pt-4 border-t border-white/5 mt-auto">
                                <button 
                                    onClick={() => handleAddToCart(item._id)}
                                    disabled={!item.isAvailable}
                                    className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                                        item.isAvailable 
                                        ? 'bg-white text-black hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]' 
                                        : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingBag className={`w-4 h-4 ${item.isAvailable ? 'group-hover/btn:scale-110 transition-transform' : ''}`} />
                                    {item.isAvailable ? 'Add to Order' : 'Unavailable'}
                                </button>
                            </div>
                        </div>
                    </div>
                    ))
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Home;