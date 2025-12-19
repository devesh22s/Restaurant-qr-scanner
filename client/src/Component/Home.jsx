import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMenuItems, setSelectedCategory } from '../redux/menuSlice';
import { addedTOCart, getCart } from '../redux/cartSlice';
import { useToast } from '../context/ToastContext';
import Hero from './Hero';


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
  const { userId } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMenuItems(selectedCategory));
  }, [dispatch, selectedCategory, searchQuery]);

  const handleCategoryChange = (category) => {
    dispatch(setSelectedCategory(category));
  };

  const handleAddToCart = async (menuItemId) => {
    if (!userId) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await dispatch(addedTOCart({ userId, menuItemId, quantity: 1 })).unwrap();
      toast.success('Item added to cart successfully!');
      dispatch(getCart(userId));
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Failed to add item to cart';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Our Menu</h1>
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
      <div id="menu-section" className="space-y-8 pt-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Our Menu</h1>
          <p className="text-gray-400">Discover our delicious vegetarian offerings</p>
        </div>

     
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-white text-black'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800/70 border border-gray-700/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

   
      {menuItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No menu items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
                {(!item.isAvailable && !item.isAvailabel) && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Unavailable
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                  <span className="text-lg font-bold text-white ml-2">
                    ₹{item.price}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <button 
                    onClick={() => handleAddToCart(item._id)}
                    // disabled={!(item.isAvailable ?? item.isAvailabel ?? true)}
                    className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {(item.isAvailable ?? item.isAvailabel ?? true) ? 'Add to Cart' : 'Unavailable'}
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