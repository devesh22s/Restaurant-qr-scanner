import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { resetCart } from '../redux/cartSlice';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Checkout page se Order ID milega
  const orderId = location.state?.orderId || "UNKNOWN";

  // Safety: Page load hote hi Cart khali kar do (agar pehle nahi hua to)
  useEffect(() => {
    dispatch(resetCart());
  }, [dispatch]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 font-manrope">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-green-500/30 rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(34,197,94,0.15)] relative overflow-hidden animate-fade-in-up">
        
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-green-500/10 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="relative z-10">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-green-900/30 to-black rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <CheckCircle className="w-12 h-12 text-green-500 drop-shadow-lg" />
            </div>

            <h1 className="text-3xl font-cinzel font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                Thank you for dining with SavoryBites. Your order has been sent to the kitchen and is being prepared with love! 👨‍🍳
            </p>

            {/* Order ID Box */}
            <div className="bg-white/5 border border-dashed border-white/10 rounded-xl p-4 mb-8">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Order Reference ID</p>
                <p className="text-xl font-mono font-bold text-yellow-500 tracking-wider select-all">
                    #{orderId}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button 
                    onClick={() => navigate('/')}
                    className="w-full py-3.5 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 group"
                >
                    <Home className="w-4 h-4" /> Go to Home
                </button>
                
                {/* Agar user login hai to Orders page par bhej sakte ho */}
                <button 
                    onClick={() => navigate('/orders')} // Ensure ye route exist karta ho
                    className="w-full py-3.5 bg-transparent border border-white/10 hover:bg-white/5 text-gray-300 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <ShoppingBag className="w-4 h-4" /> View My Orders
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;