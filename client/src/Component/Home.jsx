import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMenuItems, setSelectedCategory } from '../redux/menuSlice';
import { addedTOCart, getCart } from '../redux/cartSlice';
import { useToast } from '../context/ToastContext';
import Hero from './Hero';
import { ShoppingBag, Star, QrCode, Home as HomeIcon, AlertCircle, ChefHat } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';

// --- Premium Loading Skeleton ---
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 mt-8">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="bg-[#0a0a0a]/50 border border-white/5 rounded-2xl overflow-hidden relative">
        <div className="h-56 w-full bg-gray-800/30 animate-pulse"></div>
        <div className="p-5 space-y-4">
          <div className="flex justify-between">
             <div className="h-6 w-3/4 bg-gray-800/30 rounded animate-pulse"></div>
             <div className="h-6 w-12 bg-gray-800/30 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-full bg-gray-800/30 rounded animate-pulse"></div>
          <div className="h-4 w-2/3 bg-gray-800/30 rounded animate-pulse"></div>
          <div className="pt-4 flex justify-between items-center">
             <div className="h-4 w-16 bg-gray-800/30 rounded animate-pulse"></div>
             <div className="h-10 w-28 bg-gray-800/30 rounded animate-pulse"></div>
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
  const { menuItems, categories, loading, error, selectedCategory } = useSelector((state) => state.menu);
  
  // URL Data
  const [searchParams] = useSearchParams();
  const tableSlug = searchParams.get('table');

  // ✅ LOCAL STATE (Safe Logic)
  // Hum shuru me activeTable ko localStorage se nahi uthayenge agar URL me naya table hai
  const [activeTable, setActiveTable] = useState(() => {
    // Agar URL me table hai, to hum user se verify karwayenge (Safety First)
    if (tableSlug) return null; 
    return localStorage.getItem('tableNumber');
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(false);

  // 🛑 NOTE: No useEffect for Table Verification. Manual Trigger Only.

  // ✅ 1. MANUAL VERIFY FUNCTION (Button Click par chalega)
  const verifyTable = async () => {
    if (!tableSlug) return;

    setIsVerifying(true);
    setVerificationError(false);

    try {
      // API Call
      const res = await api.get(`/tables/slug/${tableSlug}`);
      
      if (res.data.success) {
        const tableData = res.data.data;
        
        // Success: Data Save karo
        localStorage.setItem('tableNumber', tableData.tableNumber);
        localStorage.setItem('tableId', tableData._id);
        
        setActiveTable(tableData.tableNumber);
        toast.success(`Welcome to Table ${tableData.tableNumber}`);
        
        // Ab Menu Load karo
        dispatch(fetchMenuItems("All"));
      }
    } catch (err) {
      console.error("Verification Failed:", err);
      setVerificationError(true);
      localStorage.removeItem('tableNumber');
      setActiveTable(null);
      // Koi Redirect nahi, bas UI badal denge
    } finally {
      setIsVerifying(false);
    }
  };

  // ✅ 2. Menu Fetching Logic (Sirf jab Table Active ho)
  useEffect(() => {
    if (activeTable) {
        dispatch(fetchMenuItems(selectedCategory || "All"));
    }
  }, [dispatch, activeTable, selectedCategory]);

  // --- Handlers ---
  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };

  const handleAddToCart = async (menuItemId) => {
    try {
      await dispatch(addedTOCart({ menuItemId, quantity: 1 })).unwrap();
      toast.success('Added to your feast! 🍲');
      dispatch(getCart()); 
    } catch (error) {
      toast.error(error,'Could not add item');
    }
  };

  // 🚨 UI STATE 1: ERROR SCREEN (Agar verification fail hua)
  if (verificationError) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-900/10 rounded-full blur-[100px]"></div>

        <div className="bg-red-500/10 p-8 rounded-full mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-in fade-in zoom-in duration-500">
            <AlertCircle className="w-20 h-20 text-red-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4 font-cinzel">Invalid QR Code</h2>
        <p className="text-gray-400 mb-10 max-w-md text-lg leading-relaxed font-manrope">
            We couldn't recognize this table. The QR code might be outdated or incorrect.
        </p>
        <a 
          href="/" 
          className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl overflow-hidden transition-transform active:scale-95 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
           <div className="absolute inset-0 bg-gray-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
           <span className="relative flex items-center gap-3 text-lg">
             <HomeIcon className="w-5 h-5" /> Go Back Home
           </span>
        </a>
      </div>
    );
  }

  // 🔒 UI STATE 2: VERIFICATION REQUIRED (Jab URL me table ho par active na ho)
  if (tableSlug && !activeTable) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center space-y-10 relative overflow-hidden">
        
        {/* Ambient Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px]"></div>

        <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
            <div className="relative bg-[#0a0a0a] p-8 rounded-3xl border border-yellow-500/20 shadow-2xl">
                <QrCode className="w-24 h-24 text-yellow-500" strokeWidth={1} />
            </div>
        </div>
        
        <div className="space-y-3 z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white font-cinzel tracking-tight">Table Detected</h2>
            <p className="text-gray-400 text-lg max-w-sm mx-auto font-manrope">You're just one tap away from a culinary journey.</p>
        </div>
        
        <button 
          onClick={verifyTable}
          disabled={isVerifying}
          className="group relative px-10 py-5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold text-xl rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_50px_rgba(234,179,8,0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden z-10"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          <span className="relative flex items-center gap-3">
            {isVerifying ? (
              <>
                 <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"/>
                 Verifying...
              </>
            ) : (
              <>
                 <ChefHat className="w-6 h-6" /> Enter Restaurant
              </>
            )}
          </span>
        </button>
      </div>
    );
  }

  // 🍽️ UI STATE 3: MENU (Main App)
  return (
    <div className="min-h-screen bg-[#020202]">
      {/* Hero Section */}
      <Hero activeTable={activeTable} />

      <div id="menu-section" className="relative space-y-12 pt-16 pb-24">
        
        {/* Menu Header */}
        <div className="text-center space-y-4 px-4">
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-100 to-white drop-shadow-sm">
            Our Signature Menu
          </h1>
          <p className="text-gray-400 font-manrope text-lg max-w-2xl mx-auto font-light">
            Curated with passion, crafted for your delight. Explore our vegetarian masterpieces.
          </p>
          <div className="h-1 w-24 bg-yellow-600/30 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="sticky top-4 z-40 py-4 backdrop-blur-lg bg-black/30 border-y border-white/5">
             <div className="flex flex-wrap justify-center gap-3 px-4 max-w-7xl mx-auto">
                {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border backdrop-blur-md ${
                    selectedCategory === category
                        ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] transform scale-105'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-yellow-500/50 hover:text-yellow-200 hover:bg-white/10'
                    }`}
                >
                    {category}
                </button>
                ))}
             </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Error State */}
        {error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-red-400 text-lg mb-4">Unable to load the menu.</p>
                <button onClick={() => dispatch(fetchMenuItems(selectedCategory))} className="px-6 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition">Retry</button>
            </div>
        )}

        {/* Menu Grid */}
        {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
                {menuItems.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
                        <ShoppingBag className="w-16 h-16 opacity-20" />
                        <p className="text-lg">No culinary delights found in this category yet.</p>
                    </div>
                ) : (
                    menuItems.map((item) => (
                    <div key={item._id} className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] hover:-translate-y-2">
                        
                        {/* Image Container */}
                        <div className="relative h-64 w-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 opacity-80"></div>
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Dish'; }}
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                                {!item.isAvailable && (
                                    <div className="bg-red-500/90 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                                        Sold Out
                                    </div>
                                )}
                                <div className="bg-black/60 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                    {item.category}
                                </div>
                            </div>

                            {/* Price - Floating */}
                            <div className="absolute bottom-4 left-4 z-20">
                                <span className="text-3xl font-cinzel font-bold text-yellow-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                    ₹{item.price}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 relative">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-white font-cinzel group-hover:text-yellow-500 transition-colors leading-tight">
                                    {item.name}
                                </h3>
                            </div>

                            {/* Rating Stars (Static for now, can be dynamic) */}
                            <div className="flex gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700 fill-gray-700'}`} />
                                ))}
                                <span className="text-xs text-gray-500 ml-2">(4.0)</span>
                            </div>
                            
                            <p className="text-sm text-gray-400 mb-6 line-clamp-2 font-manrope font-light leading-relaxed">
                                {item.description}
                            </p>
                            
                            {/* Action Area */}
                            <div className="pt-4 border-t border-white/5">
                                <button 
                                    onClick={() => handleAddToCart(item._id)}
                                    disabled={!item.isAvailable}
                                    className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                                        item.isAvailable 
                                        ? 'bg-yellow-600 text-black hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingBag className={`w-4 h-4 ${item.isAvailable ? 'group-hover/btn:animate-bounce' : ''}`} />
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