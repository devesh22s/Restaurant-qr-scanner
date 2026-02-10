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
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 mt-8">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="bg-[#0a0a0a]/50 border border-white/5 rounded-2xl overflow-hidden relative">
        <div className="h-56 w-full bg-gray-800/30 animate-pulse"></div>
        <div className="p-5 space-y-4">
          <div className="h-6 w-3/4 bg-gray-800/30 rounded animate-pulse"></div>
          <div className="h-4 w-full bg-gray-800/30 rounded animate-pulse"></div>
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

  // ✅ FIX: Fetch Menu ALWAYS 
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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-20 h-20 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white">Invalid QR Code</h2>
        <a href="/" className="mt-6 bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2"><HomeIcon size={18}/> Go Home</a>
      </div>
    );
  }

  // UI: Verification Required
  if (tableSlug && !activeTable) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center space-y-8">
        <QrCode className="w-24 h-24 text-yellow-500 animate-pulse" />
        <h2 className="text-3xl font-bold text-white">Table Detected</h2>
        <button onClick={verifyTable} disabled={isVerifying} className="bg-yellow-600 text-black font-bold px-10 py-4 rounded-xl text-lg flex items-center gap-2">
           {isVerifying ? "Verifying..." : <><ChefHat /> Enter Restaurant</>}
        </button>
      </div>
    );
  }

  // 🍽️ MAIN MENU UI
  return (
    <div className="min-h-screen bg-[#020202]">
      {/* Hero Section ko activeTable pass karo (agar null hai to "Welcome Guest" dikhayega) */}
      <Hero activeTable={activeTable} />

      <div id="menu-section" className="relative space-y-12 pt-16 pb-24">
        
        {/* Header */}
        <div className="text-center space-y-4 px-4">
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-100 to-white drop-shadow-sm">
            Our Signature Menu
          </h1>
          <p className="text-gray-400 font-manrope text-lg max-w-2xl mx-auto font-light">
            {searchQuery 
                ? `Searching results for "${searchQuery}"...` 
                : "Curated with passion, crafted for your delight."}
          </p>
          <div className="h-1 w-24 bg-yellow-600/30 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Categories */}
        {!searchQuery && categories.length > 0 && (
          <div className="sticky top-4 z-30 py-4 backdrop-blur-lg bg-black/30 border-y border-white/5">
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

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Error */}
        {error && (
            <div className="text-center py-20 text-red-400">
                <p>Unable to load menu.</p>
                <button onClick={() => dispatch(fetchMenuItems(selectedCategory))} className="mt-4 text-white underline">Retry</button>
            </div>
        )}

        {/* ✅ GRID */}
        {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
                
                {filteredItems.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-500 space-y-6 animate-in fade-in duration-500">
                        <div className="bg-white/5 p-6 rounded-full">
                           <SearchX className="w-16 h-16 text-yellow-500/50" />
                        </div>
                        <div className="text-center">
                           <h3 className="text-xl font-bold text-white mb-2">No items found</h3>
                           <p className="text-gray-400">
                              {searchQuery 
                                ? `We couldn't find anything matching "${searchQuery}"` 
                                : "No items in this category."}
                           </p>
                        </div>
                    </div>
                ) : (
                    filteredItems.map((item) => (
                    <div key={item._id} className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/30 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] hover:-translate-y-2">
                        
                        <div className="relative h-64 w-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 opacity-80"></div>
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Dish'; }}
                            />
                            
                            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                                {!item.isAvailable && (
                                    <div className="bg-red-500/90 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">Sold Out</div>
                                )}
                                <div className="bg-black/60 backdrop-blur-md text-white/90 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
                                    {item.category}
                                </div>
                            </div>

                            <div className="absolute bottom-4 left-4 z-20">
                                <span className="text-3xl font-cinzel font-bold text-yellow-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">₹{item.price}</span>
                            </div>
                        </div>

                        <div className="p-6 relative">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-white font-cinzel group-hover:text-yellow-500 transition-colors leading-tight">{item.name}</h3>
                            </div>
                            
                            <div className="flex gap-1 mb-3">
                                {[...Array(5)].map((_, i) => ( <Star key={i} className={`w-3.5 h-3.5 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700 fill-gray-700'}`} /> ))}
                            </div>
                            
                            <p className="text-sm text-gray-400 mb-6 line-clamp-2 font-manrope font-light leading-relaxed">{item.description}</p>
                            
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