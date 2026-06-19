import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../lib/api'; 
import { getCart, resetCart } from '../redux/cartSlice';
import { 
  Wallet, User, CheckCircle, Loader2, Phone, Mail, FileText,
  UtensilsCrossed, X, Armchair, Receipt, Sparkles, CreditCard, Banknote, ArrowRight
} from 'lucide-react';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
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

  const { items, totalCartPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [tables, setTables] = useState([]); 
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // --- INITIALIZATION ---
  const [formData, setFormData] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('customerInfo') || '{}');
    const scannedTable = localStorage.getItem('tableNumber') || localStorage.getItem('activeTable') || '';
    
    return {
      customerName: user?.name || savedUser.name || '',
      customerEmail: user?.email || savedUser.email || '',
      customerPhone: user?.contact || savedUser.phone || '', 
      tableNumber: scannedTable, 
      notes: '',
      couponCode: '',
      paymentMethod: 'cash' 
    };
  });

  const gstAmount = Math.round(totalCartPrice * 0.05);
  const grandTotal = Math.max(0, totalCartPrice + gstAmount - discount);
  const myIdentity = user?._id || localStorage.getItem("sessionToken");
  const scannedTableNumber = localStorage.getItem('tableNumber');

  // Auto-fill effect
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || prev.customerName,
        customerEmail: user.email || prev.customerEmail,
        customerPhone: user.contact || prev.customerPhone 
      }));
    }
  }, [user]);

  useEffect(() => {
    if (items.length === 0) dispatch(getCart());
    
    const fetchTables = async () => {
      try {
        const res = await api.get('/tables'); 
        if(res.data.success) {
            setTables(res.data.data.filter(t => t.isActive));
        }
      } catch (err) { console.error(err,"Failed to load tables"); }
    };
    fetchTables();
  }, [dispatch, items.length]);

  // ✅ FIX: Strict Contact Number Validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "customerPhone") {
      // Sirf numbers allow karega aur 10 digits tak lock karega
      setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, "").slice(0, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleApplyCoupon = async () => {
    if (!formData.couponCode) return toast.error("Enter coupon code");
    setCouponLoading(true);
    try {
      const res = await api.post('/coupons/verify', {
        code: formData.couponCode,
        cartTotal: totalCartPrice 
      });
      if (res.data.success) {
        setDiscount(res.data.discountAmount);
        setAppliedCoupon(res.data.code);
        toast.success(`Applied! Saved ₹${res.data.discountAmount}`);
      }
    } catch (error) {
      setDiscount(0);
      setAppliedCoupon(null);
      toast.error(error.response?.data?.message || "Invalid Coupon");
    } finally { setCouponLoading(false); }
  };

  const saveCustomerDetails = () => {
    localStorage.setItem('customerInfo', JSON.stringify({
      name: formData.customerName,
      phone: formData.customerPhone,
      email: formData.customerEmail
    }));
    localStorage.setItem('activeTable', formData.tableNumber);
  };

  const handlePlaceOrder = async () => {
    if (!formData.tableNumber) return toast.error("Please select a Table");
    if (!formData.customerPhone || formData.customerPhone.length < 10) return toast.error("Valid 10-digit number required");

    saveCustomerDetails();
    setLoading(true);

    try {
      const orderPayload = {
        couponCode: appliedCoupon || null,
        paymentMethod: formData.paymentMethod, 
        tableNumber: Number(formData.tableNumber),
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        notes: formData.notes
      };

      const response = await api.post('/orders/place', orderPayload);
      const { success, data, message } = response.data;

      if (success) {
        if (formData.paymentMethod === 'cash') {
          toast.success(message || "Order Placed Successfully! 🍲");
          dispatch(resetCart()); 
          navigate('/order-success', { 
            state: { orderId: data._id || data.orderId, orderNumber: data.orderNumber } 
          });
        } 
        else if (formData.paymentMethod === 'razorpay') {
          await handleRazorpayPayment(data);
        }
      } else {
        toast.error(message || "Order failed.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Order Error:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
      setLoading(false); 
    }
  };

  const handleRazorpayPayment = async (backendResponse) => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      setLoading(false); 
      return toast.error("Payment SDK failed");
    }

    const { razorPayDetails, order } = backendResponse;

    const options = {
      key: razorPayDetails.key, 
      amount: razorPayDetails.amount, 
      currency: razorPayDetails.currency,
      name: "SavoryBites",
      description: `Order #${order.orderNumber}`,
      order_id: razorPayDetails.id, 
      prefill: {
        name: formData.customerName,
        email: formData.customerEmail,
        contact: formData.customerPhone 
      },
      handler: async function (response) {
        try {
          toast.info("Verifying Payment...");
          const verifyRes = await api.post('/orders/verify-payment', {
            razorPayOrderId: response.razorpay_order_id,
            razorPayPaymentId: response.razorpay_payment_id,
            razorPaySignature: response.razorpay_signature
          });

          if (verifyRes.data.success) {
            toast.success("Paid Successfully!");
            dispatch(resetCart()); 
            navigate('/order-success', { state: { orderId: order._id, orderNumber: order.orderNumber } });
          }
        } catch (error) { 
          toast.error("Verification Failed"); 
        } finally { 
          setLoading(false); 
        }
      },
      theme: { color: "#D4AF37" },
      modal: { 
        ondismiss: async function() { 
          setLoading(false); 
          toast.warning("Payment Cancelled. Order not placed."); 
          try {
            await api.delete(`/orders/${order._id}`);
          } catch (err) {
            console.error("Failed to cleanup pending order", err);
          }
        } 
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (items.length === 0) return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center text-center p-6 font-manrope">
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
        <Receipt className="w-10 h-10 text-yellow-600/50" />
      </div>
      <h2 className="text-3xl text-white font-cinzel font-bold mb-2">Your Cart is Empty</h2>
      <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything yet. Discover our culinary masterpieces.</p>
      <button onClick={() => navigate('/menu')} className="px-10 py-4 bg-yellow-600 text-black font-bold font-cinzel uppercase tracking-widest rounded-xl hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all duration-300">Browse Menu</button>
    </div>
  );

  return (
    <>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.3); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.8); }
      `}</style>

      <div className="min-h-screen bg-[#020202] font-manrope selection:bg-yellow-500/30">
        <div className="max-w-7xl mx-auto pb-24 px-4 pt-10">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-yellow-200 to-white drop-shadow-sm mb-3">Finalize Your Order</h1>
            <p className="text-gray-400 text-base font-light tracking-wide">Review your details and confirm your culinary journey.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SECTION: FORMS */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Guest Details */}
              <section className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl p-6 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-600/50 group-hover:bg-yellow-500 transition-colors"></div>
                
                <h3 className="text-2xl font-cinzel font-bold text-white mb-8 flex items-center gap-4">
                  <div className="p-2.5 bg-yellow-900/20 border border-yellow-600/20 rounded-full"><User className="text-yellow-500 w-6 h-6"/></div> 
                  Guest Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase tracking-widest font-bold ml-1">Full Name</label>
                    <div className="relative group/input">
                      <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within/input:text-yellow-500 transition-colors" />
                      <input name="customerName" value={formData.customerName} onChange={handleChange} placeholder="John Doe" className="w-full bg-[#050505] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase tracking-widest font-bold ml-1">Phone Number <span className="text-red-500">*</span></label>
                    <div className="relative group/input">
                      <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within/input:text-yellow-500 transition-colors" />
                      {/* ✅ FIX: pattern, inputMode, aur maxLength apply kiye hain */}
                      <input 
                        type="text" 
                        inputMode="numeric" 
                        pattern="[0-9]{10}" 
                        maxLength="10" 
                        name="customerPhone" 
                        value={formData.customerPhone} 
                        onChange={handleChange} 
                        placeholder="9876543210" 
                        required
                        className="w-full bg-[#050505] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all" 
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase tracking-widest font-bold ml-1">Email Address <span className="text-gray-600 font-normal">(Optional)</span></label>
                    <div className="relative group/input">
                      <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within/input:text-yellow-500 transition-colors" />
                      <input type="email" name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="john@example.com" className="w-full bg-[#050505] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Dining Info */}
              <section className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl p-6 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-600/50 group-hover:bg-yellow-500 transition-colors"></div>
                
                <h3 className="text-2xl font-cinzel font-bold text-white mb-8 flex items-center gap-4">
                  <div className="p-2.5 bg-yellow-900/20 border border-yellow-600/20 rounded-full"><UtensilsCrossed className="text-yellow-500 w-6 h-6"/></div> 
                  Dining Setup
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase tracking-widest font-bold ml-1">Select Table <span className="text-red-500">*</span></label>
                    <div className="relative group/input">
                      <Armchair className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within/input:text-yellow-500 transition-colors z-10" />
                      <select 
                        name="tableNumber" 
                        value={formData.tableNumber} 
                        onChange={handleChange}
                        className="w-full bg-[#050505] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white appearance-none focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 cursor-pointer transition-all relative"
                      >
                        <option value="">-- Choose your table --</option>
                        {tables.map(table => {
                          const ownerId = table.currentOwner ? (typeof table.currentOwner === 'object' ? table.currentOwner._id : table.currentOwner) : null;
                          const isBackendMatch = table.isOccupied && String(ownerId) === String(myIdentity);
                          const isScannedMatch = String(table.tableNumber) === String(scannedTableNumber);
                          const isMyTable = isBackendMatch || isScannedMatch;
                          const isSelectable = !table.isOccupied || isMyTable;

                          let label = `Table ${table.tableNumber} (${table.capacity} Seats)`;
                          if (isMyTable) label += " - (Your Table)";
                          else if (table.isOccupied) label += " - Occupied";

                          return (
                            <option key={table._id} value={table.tableNumber} disabled={!isSelectable} className={!isSelectable ? "text-gray-600 bg-[#111]" : "text-white bg-[#0a0a0a]"}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                      {/* Custom Arrow */}
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 uppercase tracking-widest font-bold ml-1">Kitchen Notes</label>
                    <div className="relative group/input">
                      <FileText className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within/input:text-yellow-500 transition-colors" />
                      <input name="notes" value={formData.notes} onChange={handleChange} placeholder="Less spicy, allergy info..." className="w-full bg-[#050505] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl p-6 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-600/50 group-hover:bg-yellow-500 transition-colors"></div>
                
                <h3 className="text-2xl font-cinzel font-bold text-white mb-8 flex items-center gap-4">
                  <div className="p-2.5 bg-yellow-900/20 border border-yellow-600/20 rounded-full"><Wallet className="text-yellow-500 w-6 h-6"/></div> 
                  Payment Method
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <label className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden ${formData.paymentMethod === 'cash' ? 'bg-gradient-to-br from-yellow-900/20 to-[#0a0a0a] border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.15)]' : 'border-white/5 bg-[#050505] hover:border-white/20'}`}>
                    {formData.paymentMethod === 'cash' && <div className="absolute top-3 right-3"><CheckCircle className="w-5 h-5 text-yellow-500" /></div>}
                    <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleChange} className="hidden" />
                    <Banknote className={`w-10 h-10 ${formData.paymentMethod === 'cash' ? 'text-yellow-400' : 'text-gray-600'}`} />
                    <div className="text-center">
                      <span className={`block font-cinzel font-bold text-lg ${formData.paymentMethod === 'cash' ? 'text-yellow-400' : 'text-gray-400'}`}>Pay Cash</span>
                      <span className="text-xs text-gray-500">Pay after your meal</span>
                    </div>
                  </label>

                  <label className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden ${formData.paymentMethod === 'razorpay' ? 'bg-gradient-to-br from-yellow-900/20 to-[#0a0a0a] border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.15)]' : 'border-white/5 bg-[#050505] hover:border-white/20'}`}>
                    {formData.paymentMethod === 'razorpay' && <div className="absolute top-3 right-3"><CheckCircle className="w-5 h-5 text-yellow-500" /></div>}
                    <input type="radio" name="paymentMethod" value="razorpay" checked={formData.paymentMethod === 'razorpay'} onChange={handleChange} className="hidden" />
                    <CreditCard className={`w-10 h-10 ${formData.paymentMethod === 'razorpay' ? 'text-yellow-400' : 'text-gray-600'}`} />
                    <div className="text-center">
                      <span className={`block font-cinzel font-bold text-lg ${formData.paymentMethod === 'razorpay' ? 'text-yellow-400' : 'text-gray-400'}`}>Pay Online</span>
                      <span className="text-xs text-gray-500">UPI, Cards, NetBanking</span>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            {/* RIGHT SECTION: BILL */}
            <div className="lg:col-span-4">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 sticky top-24 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Top Glowing Edge */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-800 via-yellow-400 to-yellow-800"></div>
                
                <h3 className="text-2xl font-cinzel font-bold text-white mb-6 pb-4 border-b border-white/5 flex justify-between items-center">
                  Bill Summary
                  <Receipt className="text-yellow-600/50 w-6 h-6" />
                </h3>
                
                {/* Items List */}
                <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto custom-scrollbar pr-3">
                  {items.map(i => (
                    <div key={i.menuItemId} className="flex justify-between items-start group">
                      <div className="flex flex-col">
                        <span className="text-gray-200 text-sm font-medium leading-tight mb-1 group-hover:text-yellow-500 transition-colors">{i.name}</span>
                        <span className="text-gray-500 text-xs">Qty: <span className="text-gray-300">{i.quantity}</span> × ₹{i.price}</span>
                      </div>
                      <span className="text-white font-mono text-sm mt-0.5">₹{i.total}</span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="space-y-3 border-t border-dashed border-white/10 pt-5 mb-6">
                  <div className="flex justify-between text-gray-400 text-sm"><span>Item Total</span><span className="font-mono text-white">₹{totalCartPrice}</span></div>
                  <div className="flex justify-between text-gray-400 text-sm"><span>GST (5%)</span><span className="font-mono text-white">+ ₹{gstAmount}</span></div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400 text-sm font-bold bg-green-900/20 border border-green-500/20 p-2.5 rounded-lg mt-2">
                      <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4"/> Discount ({appliedCoupon})</span>
                      <span className="font-mono">- ₹{discount}</span>
                    </div>
                  )}
                </div>
                
                {/* Coupon Code Input */}
                {!appliedCoupon ? (
                  <div className="flex gap-2 mb-8 relative group/btn">
                    <input name="couponCode" value={formData.couponCode} onChange={handleChange} placeholder="ENTER COUPON CODE" className="flex-1 bg-[#050505] border border-white/10 rounded-xl p-3.5 text-xs text-white uppercase tracking-widest focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 focus:outline-none transition-all placeholder-gray-700" />
                    <button onClick={handleApplyCoupon} disabled={couponLoading} className="bg-white/5 hover:bg-yellow-600 hover:text-black text-yellow-500 px-5 rounded-xl text-xs font-bold tracking-widest border border-white/10 hover:border-yellow-600 transition-all shadow-lg">APPLY</button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-green-900/10 border border-green-500/30 p-3.5 rounded-xl mb-8">
                    <span className="text-xs text-green-400 font-bold tracking-wider flex gap-2 items-center uppercase"><CheckCircle size={16}/> Coupon Applied</span>
                    <button onClick={() => {setDiscount(0); setAppliedCoupon(null); setFormData({...formData, couponCode:''})}} className="p-1 hover:bg-green-500/20 rounded-md transition-colors"><X size={16} className="text-green-500"/></button>
                  </div>
                )}

                {/* Grand Total */}
                <div className="flex justify-between items-end border-t border-white/10 pt-5 mb-8">
                  <span className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-1">Grand Total</span>
                  <span className="text-4xl font-cinzel font-bold text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]">₹{grandTotal}</span>
                </div>

                {/* Main Action Button */}
                <button 
                  onClick={handlePlaceOrder} 
                  disabled={loading} 
                  className="group relative w-full py-4 bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-[#291d0a] font-bold rounded-xl shadow-[0_5px_20px_rgba(212,175,55,0.4)] overflow-hidden flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out skew-y-12"></div>
                  {loading ? <Loader2 className="animate-spin relative z-10 w-6 h-6" /> : (
                    <div className="relative z-10 flex items-center gap-2 font-cinzel text-lg tracking-wide">
                      {formData.paymentMethod === 'razorpay' ? 'Pay Securely' : 'Confirm Order'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                    </div>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;