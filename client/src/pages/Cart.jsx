import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseItemQuantity,
  decreaseItemQuantity,
  removeItemFromCart,
  getCart,
} from "../redux/cartSlice";
import { useEffect } from "react";




const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
 

  const { items, loading } = useSelector((state) => state.cart);
  const { userId } = useSelector((state) => state.auth);


  // whenever page load it will run 
   useEffect(() => {
  if (userId) {
    dispatch(getCart(userId));
  }
}, [userId]);

  // ===== TOTAL PRICE =====
const totalPrice = useMemo(() => {
  return items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
}, [items]);


  // ===== HANDLERS =====
const handleIncrease = (menuItemId) => {
  dispatch(increaseItemQuantity({ userId, menuItemId }));
};

const handleDecrease = (menuItemId) => {
  dispatch(decreaseItemQuantity({ userId, menuItemId }));
};

const handleRemove = (menuItemId) => {
  dispatch(removeItemFromCart({ userId, menuItemId }));
};


  // ===== EMPTY CART =====
  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 rounded-full bg-gray-800/50 border border-gray-700/50 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-400 mb-6">
          Add some delicious items to get started!
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-white text-black rounded-lg font-medium"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Shopping Cart
        </h1>
        <p className="text-gray-400">
          {items.length} {items.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.menuItemId._id || item.menuItemId}
              className="bg-gray-900/50 border border-gray-800 rounded-lg"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-40 h-40 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {item.name}
                      </h3>
                      <span className="text-xl font-bold text-white">
                        ₹{item.price}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 mb-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="flex bg-gray-800 rounded-lg">
                        <button
                          onClick={() =>
                            handleDecrease(item.menuItemId._id || item.menuItemId)
                          }
                          className="p-2"
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>

                        <span className="px-4 py-2 text-white">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleIncrease(item.menuItemId._id || item.menuItemId)
                          }
                          className="p-2"
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      <p className="text-lg font-bold text-white">
                        ₹{item.quantity * item.price}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        handleRemove(item.menuItemId._id || item.menuItemId)
                      }
                      className="p-2 text-red-400"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}
        <div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>GST (18%)</span>
                <span>₹{Math.round(totalPrice * 0.18)}</span>
              </div>

              <div className="border-t pt-4 flex justify-between">
                <span className="text-lg font-bold text-white">
                  Total
                </span>
                <span className="text-lg font-bold text-white">
                  ₹{totalPrice + Math.round(totalPrice * 0.18)}
                </span>
              </div>
            </div>

            <button className="w-full bg-white text-black py-3 rounded-lg font-medium mb-4">
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-800 text-white py-3 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
