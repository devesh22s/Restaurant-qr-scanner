import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../lib/api'; // Custom API instance
import { getCart, resetCart } from '../redux/cartSlice';
import { 
  Wallet, 
  User, 
  FileText, 
  CheckCircle,
  Loader2,
  UtensilsCrossed
} from 'lucide-react';

// Helper: Load Razorpay Script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
        resolve(true);
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  // Redux State
  const { items, totalCartPrice } = useSelector((state) => state.cart);
  const { name, email, contact,  } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: name || '',
    customerEmail: email || '',
    customerPhone: contact || '', // Default from Auth
    tableNumber: '',
    notes: '',
    couponCode: '',
    paymentMethod: 'cash' // Default selection
  });

  // Calculate Finals
  const gstAmount = Math.round(totalCartPrice * 0.05);
  const grandTotal = totalCartPrice + gstAmount;

  // Load cart if missing
  useEffect(() => {
    if (items.length === 0) {
      dispatch(getCart());
    }
  }, [dispatch, items.length]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 1. HANDLE ORDER SUBMISSION ---
  const handlePlaceOrder = async () => {
    if (!formData.tableNumber) {
        return toast.error("Please enter Table Number");
    }
    if (!formData.customerPhone) {
        return toast.error("Contact number is required");
    }

    setLoading(true);

    try {
        const orderPayload = {
            ...formData,
            tableNumber: Number(formData.tableNumber),
            // Backend handles price calculation securely
        };

        console.log("Sending Order Payload:", orderPayload);

        // API Call: Create Order
        const response = await api.post('/orders/orders', orderPayload);
        const { success, data } = response.data;

        if (success) {
            // CASE A: CASH
            if (formData.paymentMethod === 'cash') {
                toast.success("Order Placed Successfully! 🍲");
                dispatch(resetCart());
                navigate('/order-success', { state: { orderId: data.orderNumber } });
            } 
            // CASE B: RAZORPAY
            else if (formData.paymentMethod === 'razorpay') {
                await handleRazorpayPayment(data);
            }
        }

    } catch (error) {
        console.error("Order Error:", error);
        toast.error(error.response?.data?.message || "Failed to place order");
        setLoading(false);
    }
  };

  // --- 2. HANDLE RAZORPAY PAYMENT ---
  const handleRazorpayPayment = async (backendResponse) => {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
          toast.error("Razorpay SDK failed to load. Check internet.");
          setLoading(false);
          return;
      }

      // Backend se aaya hua data destructure karo
      // Controller sends: { order: {...}, razorPayDetails: { id, amount, key, currency } }
      const { razorPayDetails, order } = backendResponse;

      const options = {
          key: razorPayDetails.key, 
          amount: razorPayDetails.amount, 
          currency: razorPayDetails.currency,
          name: "SavoryBites",
          description: `Table ${formData.tableNumber} - Order Payment`,
          order_id: razorPayDetails.id, // Razorpay Order ID from Backend
          
          // SUCCESS HANDLER
          handler: async function (response) {
              try {
                  toast.info("Verifying Payment...");
                  
                  // Verify API Call
                  const verifyRes = await api.post('/orders/verify-payment', {
                      razorPayOrderId: response.razorpay_order_id,
                      razorPayPaymentId: response.razorpay_payment_id,
                      razorPaySignature: response.razorpay_signature
                  });

                  if (verifyRes.data.success) {
                      toast.success("Payment Verified! Order Confirmed.");
                      dispatch(resetCart());
                      navigate('/order-success', { state: { orderId: order.orderNumber } });
                  } else {
                      toast.error("Payment Verification Failed");
                  }
              } catch (error) {
                  console.error(error);
                  toast.error("Server Verification Failed");
              } finally {
                  setLoading(false);
              }
          },
          
          prefill: {
              name: formData.customerName,
              email: formData.customerEmail,
              contact: formData.customerPhone,
          },
          theme: {
              color: "#D4AF37", // Gold Theme
          },
          modal: {
              ondismiss: function() {
                  setLoading(false);
                  toast.warning("Payment Cancelled");
              }
          }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
  };

  if (items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center text-white">
            <p className="text-xl mb-4 font-cinzel">Your cart is empty.</p>
            <button onClick={() => navigate('/')} className="text-yellow-500 hover:underline">Go to Menu</button>
        </div>
      );
  }

  return (
    <>
      <style>
        {`
          .gold-text { color: #D4AF37; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        `}
      </style>

      <div className="max-w-7xl mx-auto pb-20 px-4 pt-6">
        <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-yellow-900/20 rounded-full border border-yellow-600/30">
                <FileText className="w-6 h-6 gold-text" />
            </div>
            <h1 className="text-3xl font-cinzel font-bold text-white">Finalize Order</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: FORM */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Customer Details */}
                <section className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-cinzel font-bold text-white mb-4 flex items-center gap-2">
                        <User className="w-4 h-4 gold-text" /> Guest Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Full Name</label>
                            <input 
                                type="text" 
                                name="customerName" 
                                value={formData.customerName} 
                                onChange={handleChange}
                                placeholder="Enter Name"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Phone Number *</label>
                            <input 
                                type="tel" 
                                name="customerPhone" 
                                value={formData.customerPhone} 
                                onChange={handleChange}
                                placeholder="Required"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none transition-colors"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Email (Optional)</label>
                            <input 
                                type="email" 
                                name="customerEmail" 
                                value={formData.customerEmail} 
                                onChange={handleChange}
                                placeholder="For receipt"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                </section>

                {/* 2. Dining Details */}
                <section className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-cinzel font-bold text-white mb-4 flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4 gold-text" /> Dining Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Table Number *</label>
                            <input 
                                type="number" 
                                name="tableNumber" 
                                value={formData.tableNumber} 
                                onChange={handleChange}
                                placeholder="Check table stand"
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Chef Notes</label>
                            <input 
                                type="text" 
                                name="notes" 
                                value={formData.notes} 
                                onChange={handleChange}
                                placeholder="Less spicy, No onions..."
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                </section>

                {/* 3. Payment Method */}
                <section className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-cinzel font-bold text-white mb-4 flex items-center gap-2">
                        <Wallet className="w-4 h-4 gold-text" /> Payment Method
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Cash Option */}
                        <label className={`cursor-pointer border rounded-xl p-4 flex items-center gap-4 transition-all ${formData.paymentMethod === 'cash' ? 'bg-yellow-900/20 border-yellow-500/50' : 'border-white/10 hover:border-white/30'}`}>
                            <input 
                                type="radio" 
                                name="paymentMethod" 
                                value="cash" 
                                checked={formData.paymentMethod === 'cash'} 
                                onChange={handleChange} 
                                className="accent-yellow-500 w-5 h-5"
                            />
                            <div>
                                <span className="font-bold text-white block">Pay at Counter</span>
                                <span className="text-xs text-gray-400">Cash / Card after meal</span>
                            </div>
                        </label>

                        {/* Razorpay Option */}
                        <label className={`cursor-pointer border rounded-xl p-4 flex items-center gap-4 transition-all ${formData.paymentMethod === 'razorpay' ? 'bg-yellow-900/20 border-yellow-500/50' : 'border-white/10 hover:border-white/30'}`}>
                            <input 
                                type="radio" 
                                name="paymentMethod" 
                                value="razorpay" 
                                checked={formData.paymentMethod === 'razorpay'} 
                                onChange={handleChange} 
                                className="accent-yellow-500 w-5 h-5"
                            />
                            <div>
                                <span className="font-bold text-white block">Pay Online</span>
                                <span className="text-xs text-gray-400">UPI, Netbanking, Cards</span>
                            </div>
                        </label>
                    </div>
                </section>

            </div>

            {/* RIGHT COLUMN: SUMMARY */}
            <div className="lg:col-span-1">
                <div className="bg-[#0a0a0a]/80 border border-yellow-600/20 rounded-xl p-6 sticky top-24 shadow-2xl">
                    <h3 className="text-xl font-cinzel font-bold text-white mb-6 border-b border-white/10 pb-4">
                        Bill Summary
                    </h3>

                    {/* Items List */}
                    <div className="space-y-3 mb-6 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {items.map(item => (
                            <div key={item.menuItemId} className="flex justify-between text-sm">
                                <span className="text-gray-400">{item.quantity} x {item.name}</span>
                                <span className="text-white font-medium">₹{item.total}</span>
                            </div>
                        ))}
                    </div>

                    {/* Calculation */}
                    <div className="space-y-3 border-t border-white/10 pt-4 mb-6">
                        <div className="flex justify-between text-gray-400 text-sm">
                            <span>Item Total</span>
                            <span>₹{totalCartPrice}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-sm">
                            <span>GST (5%)</span>
                            <span>₹{gstAmount}</span>
                        </div>
                        
                        {/* Coupon Input */}
                        <div className="pt-2">
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    name="couponCode"
                                    value={formData.couponCode}
                                    onChange={handleChange}
                                    placeholder="COUPON CODE"
                                    className="flex-1 bg-black border border-white/20 rounded px-3 py-2 text-xs text-white focus:outline-none uppercase"
                                />
                                <button className="text-xs font-bold bg-gray-800 text-yellow-500 px-3 rounded border border-gray-700 hover:bg-gray-700">
                                    APPLY
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-end border-t border-dashed border-yellow-600/30 py-4 mb-6">
                        <span className="text-gray-300 font-bold">Grand Total</span>
                        <span className="text-2xl font-bold text-yellow-500">₹{grandTotal}</span>
                    </div>

                    {/* Checkout Button */}
                    <button 
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold rounded-lg shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" /> 
                                {formData.paymentMethod === 'razorpay' ? 'Pay & Order' : 'Confirm Order'}
                            </>
                        )}
                    </button>

                    <p className="text-[10px] text-center text-gray-500 mt-4">
                        Secure checkout powered by SavoryBites
                    </p>
                </div>
            </div>

        </div>
      </div>
    </>
  );
};

export default Checkout;