import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMenuItems, setSelectedCategory } from '../redux/menuSlice';
import { addedTOCart, getCart } from '../redux/cartSlice';
import { useToast } from '../context/ToastContext';
import Hero from './Hero';
import { ShoppingBag, Star } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

// Loading Component
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden animate-pulse">
        <div className="h-48 w-full bg-gray-800/50"></div>
        <div className="p-4 space-y-3">
          <div className="h-5 w-32 bg-gray-800/50 rounded"></div>
          <div className="h-5 w-16 bg-gray-800/50 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { menuItems, categories, loading, error, selectedCategory, searchQuery } = useSelector((state) => state.menu);

  // URL Params
  const [searchParams, setSearchParams] = useSearchParams();
  const tableSlug = searchParams.get('table');

  // 🔥 CORE FIX: Slug Tracker
  // Ye yaad rakhega ki humne kis code ko check kar liya hai
  const processedSlug = useRef(null);

  // State Initialization
  const [activeTable, setActiveTable] = useState(() => {
    return localStorage.getItem('tableNumber') || null;
  });

  // ✅ 1. Table Detection Logic (With Lock)
  useEffect(() => {
    // 🛑 STOP LOGIC:
    // 1. Agar URL me table nahi hai -> RUK JAO
    // 2. Agar ye wala code hum pehle hi check kar chuke hain -> RUK JAO (Loop Broken Here)
    if (!tableSlug || processedSlug.current === tableSlug) {
        return;
    }

    // 🔒 LOCK: Is code ko "Checked" mark kar do
    processedSlug.current = tableSlug;

    const detectTable = async () => {
      try {
        const res = await api.get(`/tables/slug/${tableSlug}`);
        
        if (res.data.success) {
          const tableData = res.data.data;
          
          localStorage.setItem('tableNumber', tableData.tableNumber);
          localStorage.setItem('tableId', tableData._id);
          setActiveTable(tableData.tableNumber);
          
          toast.success(`Welcome! You are at Table ${tableData.tableNumber}`);
        }
      } catch (error) {
        console.error(error,"Invalid QR Code");

        // ⚠️ Invalid QR Handling
        
        // 1. Error dikhao (Sirf ek baar dikhega kyunki processedSlug set hai)
        toast.error("Invalid or Expired QR Code.");

        // 2. Data saaf karo
        localStorage.removeItem('tableNumber');
        setActiveTable(null);

        // 3. 🔥 URL se ?table=... hata do (Clean URL)
        // SetSearchParams URL ko update kar dega bina page reload kiye
        setSearchParams({}); 
        
        // Safety: Navigate to Home (replace history)
        navigate('/', { replace: true });
      }
    };

    detectTable();
  }, [tableSlug, navigate, toast, setSearchParams]); 

  // ✅ 2. Menu Fetching Logic
  useEffect(() => {
    dispatch(fetchMenuItems(selectedCategory));
  }, [dispatch, selectedCategory, searchQuery]);

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };

  const handleAddToCart = async (menuItemId) => {
    try {
      await dispatch(addedTOCart({ menuItemId, quantity: 1 })).unwrap();
      toast.success('Item added to cart successfully!');
      dispatch(getCart()); 
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to add item';
      toast.error(errorMessage);
    }
  };

  if (loading) return <div className="space-y-8"><LoadingSkeleton /></div>;

  if (error) {
    return (
      <div className="space-y-8">
        <div><h1 className="text-3xl font-bold text-white mb-2">Our Menu</h1></div>
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-gray-900/30 border border-red-500/20 rounded-lg p-8">
          <div className="text-red-400 text-lg font-semibold mb-2">Error loading menu</div>
          <button onClick={() => dispatch(fetchMenuItems(selectedCategory))} className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Hero activeTable={activeTable} />

      <div id="menu-section" className="space-y-8 pt-12 pb-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-white mb-2">Our Menu</h1>
          <p className="text-gray-400 font-manrope">Discover our delicious vegetarian offerings</p>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 px-4">
            {categories.map((category) => (
              <button key={category} onClick={() => handleCategoryChange(category)} className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-all border ${selectedCategory === category ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-transparent text-gray-400 border-gray-800'}`}>
                {category}
              </button>
            ))}
          </div>
        )}

        {menuItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No items found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {menuItems.map((item) => (
              <div key={item._id} className="group relative bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden">
                <div className="relative h-56 w-full overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Dish'; }} />
                  {!item.isAvailable && <div className="absolute top-3 right-3 z-20 bg-red-500/90 text-white px-3 py-1 rounded-sm text-xs font-bold uppercase backdrop-blur-md">Sold Out</div>}
                  <div className="absolute bottom-3 left-3 z-20"><span className="text-2xl font-cinzel font-bold text-yellow-500 drop-shadow-md">₹{item.price}</span></div>
                </div>
                <div className="p-5 relative">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white font-cinzel">{item.name}</h3>
                    <div className="flex gap-0.5 text-yellow-500/80"><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /></div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 font-manrope font-light">{item.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold border border-gray-800 px-2 py-1 rounded">{item.category}</span>
                    <button onClick={() => handleAddToCart(item._id)} disabled={!item.isAvailable} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${item.isAvailable ? 'bg-yellow-600 text-black hover:bg-yellow-400' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                      <ShoppingBag className="w-4 h-4" /> {item.isAvailable ? 'Add' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;