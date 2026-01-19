import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChefHat } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseItemQuantity,
  decreaseItemQuantity,
  removeItemFromCart,
  getCart,
} from "../redux/cartSlice";
import { useToast } from "../context/ToastContext"; // Added Toast

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const { items, loading } = useSelector((state) => state.cart);
  
  // LOGIC FIX: User ID check hata diya. Backend header se identity lega.
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // ===== TOTAL PRICE =====
  const totalPrice = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  }, [items]);

  // ===== HANDLERS (No userId needed in params) =====
  const handleIncrease = (menuItemId) => {
    dispatch(increaseItemQuantity({ menuItemId }));
  };

  const handleDecrease = (menuItemId) => {
    dispatch(decreaseItemQuantity({ menuItemId }));
  };

  const handleRemove = (menuItemId) => {
    dispatch(removeItemFromCart({ menuItemId }));
    toast.info("Item removed");
  };

  const handleCheckout = () => {
    // Navigate to checkout or open modal
    // navigate("/checkout"); 
    toast.success("Proceeding to payment gateway...");
  };

  // ===== EMPTY CART UI =====
  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 rounded-full bg-yellow-900/10 border border-yellow-600/30 flex items-center justify-center mb-6 animate-pulse">
          <ShoppingBag className="w-10 h-10 text-yellow-500" />
        </div>
        <h2 className="text-3xl font-cinzel font-bold text-white mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-gray-400 mb-8 font-manrope">
          Looks like you haven't made your choice yet.
        </p>
        <button
          onClick={() => navigate("/")}
          className="group relative px-8 py-3 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#291d0a] font-bold rounded-sm shadow-lg overflow-hidden transition-transform active:scale-95"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <span className="relative font-cinzel tracking-wide">Browse Menu</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <div className="p-3 bg-yellow-900/10 rounded-full border border-yellow-600/20">
            <ChefHat className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
            <h1 className="text-3xl font-cinzel font-bold text-white">Your Selection</h1>
            <p className="text-yellow-600/70 text-xs uppercase tracking-widest font-bold mt-1">
            {items.length} {items.length === 1 ? "Dish" : "Dishes"} added
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        
        {/* CART ITEMS LIST */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div
              key={item.menuItemId._id || item.menuItemId}
              className="group bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden hover:border-yellow-600/30 transition-all duration-300 flex flex-col sm:flex-row"
            >
              {/* Image */}
              <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Details */}
              <div className="flex-1 p-6 flex flex-col justify-between relative">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-cinzel font-bold text-white group-hover:text-yellow-500 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-lg font-bold text-yellow-500/90 font-manrope">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 font-manrope mb-4">
                    {item.description || "Delicious delicacy prepared with fresh ingredients."}
                  </p>
                </div>

                <div className="flex justify-between items-end border-t border-white/5 pt-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 bg-black/50 rounded-lg p-1 border border-white/10">
                    <button
                      onClick={() => handleDecrease(item.menuItemId._id || item.menuItemId)}
                      className="w-8 h-8 flex items-center justify-center rounded bg-gray-800 hover:bg-red-900/30 text-white hover:text-red-400 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrease(item.menuItemId._id || item.menuItemId)}
                      className="w-8 h-8 flex items-center justify-center rounded bg-gray-800 hover:bg-green-900/30 text-white hover:text-green-400 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.menuItemId._id || item.menuItemId)}
                    className="flex items-center gap-2 text-xs text-red-500/60 hover:text-red-400 font-bold uppercase tracking-wider hover:underline transition-all"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY (Sticky) */}
        <div className="lg:col-span-1">
          <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-yellow-600/20 rounded-xl p-8 sticky top-24 shadow-2xl">
            <h2 className="text-xl font-cinzel font-bold text-white mb-6 border-b border-white/10 pb-4">
              Bill Details
            </h2>

            <div className="space-y-4 mb-6 font-manrope">
              <div className="flex justify-between text-gray-400 text-sm">
                <span>Item Total</span>
                <span className="text-white">₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <span>GST (5%)</span>
                <span className="text-white">₹{Math.round(totalPrice * 0.05)}</span>
              </div>
               <div className="flex justify-between text-green-400 text-sm">
                <span>Discount</span>
                <span>- ₹0</span>
              </div>
            </div>

            <div className="border-t border-dashed border-yellow-600/30 py-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="text-gray-300 font-bold">Grand Total</span>
                <span className="text-2xl font-bold text-yellow-500">
                  ₹{totalPrice + Math.round(totalPrice * 0.05)}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1 text-right">Inclusive of all taxes</p>
            </div>

            <button 
                onClick={handleCheckout}
                className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all flex items-center justify-center gap-2 group"
            >
              <span className="font-cinzel tracking-wider">Place Order</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs uppercase tracking-widest">Secure Checkout</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;