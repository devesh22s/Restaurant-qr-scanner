import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMenuItems, setSelectedCategory } from '../redux/menuSlice';
import { addedTOCart, getCart } from '../redux/cartSlice';
import { useToast } from '../context/ToastContext';
import Hero from './Hero';
import { ShoppingBag, Star, Info } from 'lucide-react';

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden animate-pulse"
      >
     
        <div className="h-48 w-full bg-gray-800/50"></div>
        
     
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="h-5 w-32 bg-gray-800/50 rounded"></div>
            <div className="h-5 w-16 bg-gray-800/50 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-800/50 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-800/50 rounded"></div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="h-3 w-20 bg-gray-800/50 rounded"></div>
            <div className="h-8 w-24 bg-gray-800/50 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { menuItems, categories, loading, error, selectedCategory, searchQuery } = useSelector((state) => state.menu);


  // NOTE: Guest user ke paas userId nahi hoga, isliye hum sirf auth check nahi karenge
  // Backend headers (sessionToken) handle karega.

  // const { userId } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMenuItems(selectedCategory));
  }, [dispatch, selectedCategory, searchQuery]);

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };

  const handleAddToCart = async (menuItemId) => {
    try {
      // FIX: No userId check needed. Headers will handle identity.
      await dispatch(addedTOCart({ menuItemId, quantity: 1 })).unwrap();
      toast.success('Item added to cart successfully!');
      
      // Cart refresh karo
      dispatch(getCart()); 
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to add item';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white text-center py-20">Our Menu</h1>
          <p className="text-gray-400">Discover our delicious vegetarian offerings</p>
        </div>

        {/* Loading skeleton */}
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Our Menu</h1>
          <p className="text-gray-400">Discover our delicious vegetarian offerings</p>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-gray-900/30 border border-red-500/20 rounded-lg p-8">
          <div className="text-red-400 text-lg font-semibold mb-2">Error loading menu</div>
          <div className="text-gray-400 text-sm mb-4">{error}</div>
          <button
            onClick={() => dispatch(fetchMenuItems(selectedCategory))}
            className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Menu Section */}
      <div id="menu-section" className="space-y-8 pt-12 pb-20">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-white mb-2">Our Menu</h1>
          <p className="text-gray-400 font-manrope">Discover our delicious vegetarian offerings</p>
        </div>

     
     {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 px-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 border ${
                  selectedCategory === category
                    ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                    : 'bg-transparent text-gray-400 border-gray-800 hover:border-yellow-500/50 hover:text-yellow-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

   
    {/* Menu Grid */}
        {menuItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No items found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="group relative bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden hover:border-yellow-500/30 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60"></div>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Dish'; }}
                  />
                  {(!item.isAvailable) && (
                    <div className="absolute top-3 right-3 z-20 bg-red-500/90 text-white px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                      Sold Out
                    </div>
                  )}
                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 z-20">
                     <span className="text-2xl font-cinzel font-bold text-yellow-500 drop-shadow-md">₹{item.price}</span>
                  </div>
                </div>

   {/* Content Section */}
                <div className="p-5 relative">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white font-cinzel group-hover:text-yellow-500 transition-colors">{item.name}</h3>
                    <div className="flex gap-0.5 text-yellow-500/80">
                         <Star className="w-3 h-3 fill-current" />
                         <Star className="w-3 h-3 fill-current" />
                         <Star className="w-3 h-3 fill-current" />
                         <Star className="w-3 h-3 fill-current" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 font-manrope font-light">{item.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold border border-gray-800 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    
                    <button 
                      onClick={() => handleAddToCart(item._id)}
                      disabled={!item.isAvailable}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                        item.isAvailable 
                        ? 'bg-yellow-600 text-black hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {item.isAvailable ? 'Add' : 'Unavailable'}
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