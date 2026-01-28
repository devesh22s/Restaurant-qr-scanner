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
  const [searchParams] = useSearchParams();
  const tableSlug = searchParams.get('table');

  // ✅ Simple Error State
  const [qrError, setQrError] = useState(false);
  const dataFetched = useRef(false); // Double call check

  const [activeTable, setActiveTable] = useState(() => localStorage.getItem('tableNumber') || null);

  // ✅ 1. Very Simple Table Logic
  useEffect(() => {
    // Agar URL me table nahi hai, to bas ruk jao.
    if (!tableSlug) return;

    // Agar hum pehle hi check kar chuke hain, to wapas mat karo
    if (dataFetched.current) return;

    const verifyTable = async () => {
      dataFetched.current = true; // Lock laga diya

      try {
        const res = await api.get(`/tables/slug/${tableSlug}`);
        
        if (res.data.success) {
          const tableData = res.data.data;
          // Valid Table
          localStorage.setItem('tableNumber', tableData.tableNumber);
          localStorage.setItem('tableId', tableData._id);
          setActiveTable(tableData.tableNumber);
          toast.success(`Welcome to Table ${tableData.tableNumber}`);
        }
      } catch (err) {
        console.error("QR Error:", err);
        
        // 🛑 STOP: Bas Error State ON kar do.
        // Hum URL change nahi karenge, Redirect nahi karenge.
        // Isse Loop 100% Impossible hai.
        setQrError(true);
        localStorage.removeItem('tableNumber');
        setActiveTable(null);
      }
    };

    verifyTable();
  }, [tableSlug]); // Dependency safe hai

  // ✅ 2. Menu Fetching
  useEffect(() => {
    if (!qrError) {
        dispatch(fetchMenuItems(selectedCategory));
    }
  }, [dispatch, selectedCategory, searchQuery, qrError]);

  const handleCategoryChange = (category) => dispatch(setSelectedCategory(category));
  
  const handleAddToCart = async (id) => {
    try { await dispatch(addedTOCart({ menuItemId: id, quantity: 1 })).unwrap(); toast.success('Added!'); dispatch(getCart()); } 
    catch (e) { toast.error("Failed"); }
  };

  // 🚨 ERROR UI (Jab QR galat ho)
  if (qrError) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Invalid Table QR</h2>
        <p className="text-gray-400 mb-6">Please scan a valid QR code provided by the staff.</p>
        
        {/* Simple Button: User khud click karega tabhi hatega */}
        <a href="/" className="bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2">
           <HomeIcon size={20}/> Go to Home
        </a>
      </div>
    );
  }

  if (loading) return <div className="space-y-8"><div className="text-center text-white py-20">Loading...</div><LoadingSkeleton /></div>;

  return (
    <div>
      <Hero activeTable={activeTable} />
      <div id="menu-section" className="space-y-8 pt-12 pb-20">
        <div className="text-center"><h1 className="text-3xl font-bold text-white">Our Menu</h1></div>
        
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 px-4">
            {categories.map((cat) => (
              <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-6 py-2 rounded-full border ${selectedCategory === cat ? 'bg-yellow-500 text-black' : 'text-gray-400 border-gray-800'}`}>{cat}</button>
            ))}
          </div>
        )}

        {/* Items */}
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