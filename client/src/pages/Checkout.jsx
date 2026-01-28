import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../lib/api'; 
import { getCart, resetCart } from '../redux/cartSlice';
import { 
  Wallet, User, CheckCircle, Loader2, 
  UtensilsCrossed, X, Armchair, Receipt, Sparkles, CreditCard, Banknote
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
  
  // ✅ AUTH SLICE SE USER NIKALA
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
      
      // ✅ PRIORITY: Redux (User) > LocalStorage (Guest) > Empty
      return {
        customerName: user?.name || savedUser.name || '',
        customerEmail: user?.email || savedUser.email || '',
        customerPhone: user?.contact || savedUser.phone || '', // 'contact' aapke register form se match hona chahiye
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

  // ✅ AUTO-FILL EFFECT (Agar page reload ho aur Redux late load ho)
  useEffect(() => {
    if (user) {
        setFormData(prev => ({
            ...prev,
            customerName: user.name || prev.customerName,
            customerEmail: user.email || prev.customerEmail,
            customerPhone: user.contact || prev.customerPhone // Make sure backend returns 'contact'
        }));
    }
  }, [user]);

  // 1. Fetch Data
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Apply Coupon
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

  // 3. MAIN ORDER FUNCTION
  const handlePlaceOrder = async () => {
    if (!formData.tableNumber) return toast.error("Please select a Table");
    if (!formData.customerPhone) return toast.error("Contact number is required");

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

  // 4. Razorpay Handler
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
                  toast.error(error,"Verification Failed"); 
              } finally { 
                  setLoading(false); 
              }
          },
          theme: { color: "#D4AF37" },
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

  if (items.length === 0) return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center text-center p-6">
        <Receipt className="w-16 h-16 text-yellow-600/30 mb-4" />
        <h2 className="text-2xl text-white font-cinzel font-bold">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <button onClick={() => navigate('/menu')} className="px-8 py-3 bg-yellow-600 text-black font-bold rounded-lg hover:bg-yellow-500 transition">Browse Menu</button>
    </div>
  );

  return (
    <>
    <style>{`
        .gold-border { border: 1px solid rgba(212, 175, 55, 0.2); }
        .gold-glow:focus { box-shadow: 0 0 10px rgba(212, 175, 55, 0.2); border-color: rgba(212, 175, 55, 0.6); }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
    `}</style>

    <div className="min-h-screen bg-[#020202] font-manrope selection:bg-yellow-500/30">
       <div className="max-w-7xl mx-auto pb-24 px-4 pt-10">
          
          <div className="text-center mb-10">
             <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FDE68A] via-[#D4AF37] to-[#FDE68A] drop-shadow-sm mb-2">Finalize Your Order</h1>
             <p className="text-gray-400 text-sm">Review your details and confirm to start cooking.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
             
             {/* LEFT SECTION: FORMS */}
             <div className="lg:col-span-2 space-y-6">
                
                {/* Guest Details */}
                <section className="bg-[#0a0a0a]/60 backdrop-blur-sm gold-border rounded-2xl p-6 md:p-8">
                   <h3 className="text-xl font-cinzel font-bold text-white mb-6 flex items-center gap-3">
                      <div className="p-2 bg-yellow-900/20 rounded-full"><User className="text-yellow-500 w-5 h-5"/></div> 
                      Guest Details
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-1">
                         <label className="text-xs text-yellow-600 uppercase tracking-widest font-bold ml-1">Full Name</label>
                         <input name="customerName" value={formData.customerName} onChange={handleChange} placeholder="John Doe" className="w-full bg-black/50 gold-border rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none gold-glow transition-all" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-yellow-600 uppercase tracking-widest font-bold ml-1">Phone Number *</label>
                         <input name="customerPhone" value={formData.customerPhone} onChange={handleChange} placeholder="9876543210" className="w-full bg-black/50 gold-border rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none gold-glow transition-all" />
                      </div>
                      <div className="md:col-span-2 space-y-1">
                         <label className="text-xs text-yellow-600 uppercase tracking-widest font-bold ml-1">Email Address (Optional)</label>
                         <input name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="john@example.com" className="w-full bg-black/50 gold-border rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none gold-glow transition-all" />
                      </div>
                   </div>
                </section>

                {/* Dining Info */}
                <section className="bg-[#0a0a0a]/60 backdrop-blur-sm gold-border rounded-2xl p-6 md:p-8">
                   <h3 className="text-xl font-cinzel font-bold text-white mb-6 flex items-center gap-3">
                      <div className="p-2 bg-yellow-900/20 rounded-full"><UtensilsCrossed className="text-yellow-500 w-5 h-5"/></div> 
                      Dining Info
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="relative space-y-1">
                         <label className="text-xs text-yellow-600 uppercase tracking-widest font-bold ml-1">Select Table *</label>
                         <div className="relative">
                           <Armchair className="absolute left-4 top-4 text-yellow-500/50 w-5 h-5"/>
                           <select 
                               name="tableNumber" 
                               value={formData.tableNumber} 
                               onChange={handleChange}
                               className="w-full bg-black/50 gold-border rounded-xl p-4 pl-12 text-white appearance-none focus:outline-none gold-glow cursor-pointer"
                           >
                               <option value="">-- Choose Table --</option>
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
                                       <option key={table._id} value={table.tableNumber} disabled={!isSelectable} className={!isSelectable ? "text-gray-600 bg-gray-900" : "text-white bg-black"}>
                                           {label}
                                       </option>
                                   );
                               })}
                           </select>
                         </div>
                      </div>
                      <div className="space-y-1">
                         <label className="text-xs text-yellow-600 uppercase tracking-widest font-bold ml-1">Kitchen Notes</label>
                         <input name="notes" value={formData.notes} onChange={handleChange} placeholder="Less spicy, allergy info..." className="w-full bg-black/50 gold-border rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none gold-glow transition-all" />
                      </div>
                   </div>
                </section>

                <section className="bg-[#0a0a0a]/60 backdrop-blur-sm gold-border rounded-2xl p-6 md:p-8">
                   <h3 className="text-xl font-cinzel font-bold text-white mb-6 flex items-center gap-3">
                      <div className="p-2 bg-yellow-900/20 rounded-full"><Wallet className="text-yellow-500 w-5 h-5"/></div> 
                      Payment Method
                   </h3>
                   <div className="grid grid-cols-2 gap-4">
                      <label className={`cursor-pointer border rounded-xl p-5 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${formData.paymentMethod === 'cash' ? 'bg-gradient-to-br from-yellow-900/40 to-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}>
                         <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleChange} className="hidden" />
                         <Banknote className={`w-8 h-8 ${formData.paymentMethod === 'cash' ? 'text-yellow-400' : 'text-gray-500'}`} />
                         <span className={`font-bold ${formData.paymentMethod === 'cash' ? 'text-yellow-400' : 'text-gray-400'}`}>Pay Cash</span>
                      </label>
                      <label className={`cursor-pointer border rounded-xl p-5 flex flex-col items-center justify-center gap-2 transition-all duration-300 ${formData.paymentMethod === 'razorpay' ? 'bg-gradient-to-br from-yellow-900/40 to-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}>
                         <input type="radio" name="paymentMethod" value="razorpay" checked={formData.paymentMethod === 'razorpay'} onChange={handleChange} className="hidden" />
                         <CreditCard className={`w-8 h-8 ${formData.paymentMethod === 'razorpay' ? 'text-yellow-400' : 'text-gray-500'}`} />
                         <span className={`font-bold ${formData.paymentMethod === 'razorpay' ? 'text-yellow-400' : 'text-gray-400'}`}>Pay Online</span>
                      </label>
                   </div>
                </section>
             </div>

             {/* RIGHT SECTION: BILL */}
             <div className="lg:col-span-1">
                 <div className="bg-[#0a0a0a] gold-border rounded-2xl p-6 sticky top-24 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700"></div>
                    
                    <h3 className="text-xl font-cinzel font-bold text-white mb-6 pb-4 border-b border-dashed border-white/10 flex justify-between items-center">
                        Bill Summary
                        <Receipt className="text-gray-600 w-5 h-5" />
                    </h3>
                    
                    <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                       {items.map(i => (
                          <div key={i.menuItemId} className="flex justify-between items-start text-sm">
                             <div className="flex flex-col">
                                <span className="text-gray-300 font-medium">{i.name}</span>
                                <span className="text-gray-600 text-xs">Qty: {i.quantity}</span>
                             </div>
                             <span className="text-white font-mono">₹{i.total}</span>
                          </div>
                       ))}
                    </div>

                    <div className="space-y-3 border-t border-dashed border-white/10 pt-4 mb-6">
                       <div className="flex justify-between text-gray-400 text-sm"><span>Item Total</span><span className="font-mono">₹{totalCartPrice}</span></div>
                       <div className="flex justify-between text-gray-400 text-sm"><span>GST (5%)</span><span className="font-mono">+ ₹{gstAmount}</span></div>
                       {discount > 0 && (
                          <div className="flex justify-between text-green-400 text-sm font-bold bg-green-900/10 p-2 rounded">
                             <span className="flex items-center gap-1"><Sparkles className="w-3 h-3"/> Discount ({appliedCoupon})</span>
                             <span className="font-mono">- ₹{discount}</span>
                          </div>
                       )}
                    </div>
                    
                    {!appliedCoupon ? (
                       <div className="flex gap-2 mb-6">
                          <input name="couponCode" value={formData.couponCode} onChange={handleChange} placeholder="COUPON CODE" className="flex-1 bg-black border border-white/10 rounded-lg p-3 text-xs text-white uppercase focus:border-yellow-500 focus:outline-none transition-colors" />
                          <button onClick={handleApplyCoupon} disabled={couponLoading} className="bg-white/10 hover:bg-yellow-600 hover:text-black text-yellow-500 px-4 rounded-lg text-xs font-bold border border-yellow-600/30 transition-all">APPLY</button>
                       </div>
                    ) : (
                       <div className="flex justify-between items-center bg-green-900/20 border border-green-500/30 p-3 rounded-lg mb-6">
                          <span className="text-xs text-green-400 font-bold flex gap-2 items-center"><CheckCircle size={14}/> Coupon Applied</span>
                          <button onClick={() => {setDiscount(0); setAppliedCoupon(null); setFormData({...formData, couponCode:''})}}><X size={16} className="text-gray-400 hover:text-white transition-colors"/></button>
                       </div>
                    )}

                    <div className="flex justify-between items-end border-t-2 border-yellow-600/20 pt-4 mb-6">
                       <span className="text-gray-300 font-bold text-lg">Grand Total</span>
                       <span className="text-3xl font-cinzel font-bold text-yellow-500 drop-shadow-md">₹{grandTotal}</span>
                    </div>

                    <button 
                        onClick={handlePlaceOrder} 
                        disabled={loading} 
                        className="group w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                       {loading ? <Loader2 className="animate-spin" /> : (
                           <>
                             {formData.paymentMethod === 'razorpay' ? 'Pay Securely' : 'Confirm Order'}
                             <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform"/>
                           </>
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