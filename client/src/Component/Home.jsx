import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMenuItems, setSelectedCategory } from '../redux/menuSlice';
import { addedTOCart, getCart } from '../redux/cartSlice';
import { useToast } from '../context/ToastContext';
import Hero from './Hero';
import { ShoppingBag, Star, AlertCircle, Home as HomeIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom'; 
import api from '../lib/api';

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden animate-pulse">
        <div className="h-48 w-full bg-gray-800/50"></div>
        <div className="p-4 space-y-3"><div className="h-5 w-32 bg-gray-800/50 rounded"></div></div>
      </div>
    ))}
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  
  const { menuItems, categories, loading, error, selectedCategory, searchQuery } = useSelector((state) => state.menu);
  
  // URL Params
  const [searchParams] = useSearchParams();
  const tableSlug = searchParams.get('table');

  // ✅ Loop Breaker State
  const [isQrError, setIsQrError] = useState(false);
  
  // ✅ API Lock
  const isRequesting = useRef(false);

  const [activeTable, setActiveTable] = useState(() => localStorage.getItem('tableNumber') || null);

  // 🔥 CORE FIX: Native Browser History Logic
  useEffect(() => {
    // 1. Agar slug nahi hai, to kuch mat karo.
    if (!tableSlug) return;

    // 2. Agar humne pehle hi dekh liya ki ye QR kharab hai (Session Storage check)
    // To dobara API call mat karo, bas Error dikhao.
    if (sessionStorage.getItem(`bad_qr_${tableSlug}`)) {
        setIsQrError(true);
        // URL se parameter hata do taaki refresh pe bhi loop na ho
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path:newUrl},'',newUrl);
        return;
    }

    // 3. Locking Mechanism
    if (isRequesting.current) return;
    isRequesting.current = true;

    const detectTable = async () => {
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
        console.error("QR Failed:", err);

        // 🛑 STOP LOGIC (React Router nahi use karenge)
        
        // A. Is QR ko blacklist karo
        sessionStorage.setItem(`bad_qr_${tableSlug}`, "true");

        // B. Error State Set karo
        setIsQrError(true);
        localStorage.removeItem('tableNumber');
        setActiveTable(null);

        // C. 🔥 WINDOW HISTORY HACK (Yeh Loop kaat dega)
        // Ye browser ke address bar ko bina page reload kiye saaf kar deta hai.
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path:newUrl},'',newUrl);
        
      } finally {
        isRequesting.current = false;
      }
    };

    detectTable();
  }, [tableSlug]); // Sirf tableSlug dependency hai

  // ✅ Menu Fetching
  useEffect(() => {
    if (!isQrError) {
        dispatch(fetchMenuItems(selectedCategory));
    }
  }, [dispatch, selectedCategory, searchQuery, isQrError]);

  const handleCategoryChange = (category) => dispatch(setSelectedCategory(category));
  
  const handleAddToCart = async (id) => {
    try { await dispatch(addedTOCart({ menuItemId: id, quantity: 1 })).unwrap(); toast.success('Added!'); dispatch(getCart()); } 
    catch (e) { toast.error("Failed"); }
  };

  // 🚨 UI: Invalid QR Screen
  if (isQrError) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/10 p-6 rounded-full mb-6 border border-red-500/20">
            <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-3 font-cinzel">QR Code Invalid</h2>
        <p className="text-gray-400 mb-8 max-w-md">
            This QR code does not exist in the database.
        </p>
        <button 
          onClick={() => {
             // Hard Reload to reset everything
             window.location.href = window.location.origin;
          }}
          className="bg-yellow-600 text-black font-bold px-8 py-3 rounded-xl hover:bg-yellow-500 transition-all flex items-center gap-2"
        >
          <HomeIcon className="w-5 h-5" /> Go to Home
        </button>
      </div>
    );
  }

  if (loading) return <div className="space-y-8"><div className="py-20 text-center text-white">Loading...</div><LoadingSkeleton /></div>;

  return (
    <div>
      <Hero activeTable={activeTable} />
      <div id="menu-section" className="space-y-8 pt-12 pb-20">
        <div className="text-center"><h1 className="text-3xl font-bold text-white">Our Menu</h1></div>
        
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 px-4">
            {categories.map((cat) => (
              <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-6 py-2 rounded-full border ${selectedCategory === cat ? 'bg-yellow-500 text-black' : 'text-gray-400 border-gray-800'}`}>{cat}</button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 mt-8">
            {menuItems.map((item) => (
              <div key={item._id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                 <div className="h-48 w-full relative">
                    <img src={item.image} className="w-full h-full object-cover" onError={(e)=>e.target.src='https://via.placeholder.com/400'}/>
                    {!item.isAvailable && <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">Sold Out</div>}
                 </div>
                 <div className="p-4">
                    <h3 className="text-white font-bold">{item.name}</h3>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-yellow-500 font-bold">₹{item.price}</span>
                        <button onClick={() => handleAddToCart(item._id)} disabled={!item.isAvailable} className="bg-yellow-600 text-black px-4 py-1 rounded font-bold">Add</button>
                    </div>
                 </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;