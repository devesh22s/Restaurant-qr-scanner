import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../lib/api'; 
import { getCart, resetCart } from '../redux/cartSlice';
import { 
  Wallet, User, CheckCircle, Loader2, 
  UtensilsCrossed, X, Armchair 
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
  const { name, email, contact, userId } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [tables, setTables] = useState([]); 
  
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // --- ✅ SMART INITIALIZATION (Auto-Fill Logic) ---
  // Redux (Login) > LocalStorage (Previous Guest) > Empty
  const [formData, setFormData] = useState(() => {
      const savedUser = JSON.parse(localStorage.getItem('customerInfo') || '{}');
      const savedTable = localStorage.getItem('activeTable') || '';
      
      return {
        customerName: name || savedUser.name || '',
        customerEmail: email || savedUser.email || '',
        customerPhone: contact || savedUser.phone || '', 
        tableNumber: savedTable, // Auto-select last table
        notes: '',
        couponCode: '',
        paymentMethod: 'cash' 
      };
  });

  const gstAmount = Math.round(totalCartPrice * 0.05);
  const grandTotal = Math.max(0, totalCartPrice + gstAmount - discount);

  // Backend Identity
  const myIdentity = userId || localStorage.getItem("sessionToken");
  // Local Storage Identity (For Table Persistence)
  const savedActiveTable = localStorage.getItem('activeTable');
// ✅ Page Load hote hi Table Number auto-fill karne ke liye
useEffect(() => {
    const savedTable = localStorage.getItem('tableNumber');
    
    // Agar QR scan karke aaya hai, to wahi table select kar do
    if (savedTable) {
        setFormData(prev => ({ 
            ...prev, 
            tableNumber: savedTable 
        }));
    }
}, []); // 👈 Khali array ka matlab ye sirf 1 baar chalega

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

  // ✅ Helper: Save Details for Next Time
  const saveCustomerDetails = () => {
      localStorage.setItem('customerInfo', JSON.stringify({
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail
      }));
      // Save Table so next time it is auto-selected
      localStorage.setItem('activeTable', formData.tableNumber);
  };

  // 3. MAIN ORDER FUNCTION
  const handlePlaceOrder = async () => {
    if (!formData.tableNumber) return toast.error("Please select a Table");
    if (!formData.customerPhone) return toast.error("Contact number is required");

const storedTableNumber = localStorage.getItem('tableNumber');
    if (!storedTableNumber) {
        toast.error("Please scan the QR code on your table first!");
        return;
    }

    // Save details before making request
    saveCustomerDetails();

    setLoading(true);

    try {
        const orderPayload = {
            couponCode: appliedCoupon || null,
            paymentMethod: formData.paymentMethod, 
            tableNumber: Number(storedTableNumber),
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            customerEmail: formData.customerEmail,
            notes: formData.notes
        };

        const response = await api.post('/orders/place', orderPayload);
        const { success, data, message } = response.data;

        if (success) {
            // === CASH ===
            if (formData.paymentMethod === 'cash') {
                toast.success(message || "Order Placed Successfully! 🍲");
                dispatch(resetCart()); 
                navigate('/order-success', { 
                    state: { orderId: data._id || data.orderId, orderNumber: data.orderNumber } 
                });
                return;
            } 
            // === ONLINE ===
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

  if (items.length === 0) return <div className="text-white text-center pt-20">Cart Empty</div>;

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 pt-6">
       <h1 className="text-3xl font-cinzel font-bold text-white mb-8">Finalize Order</h1>
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             {/* Guest Details */}
             <section className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex gap-2"><User className="text-yellow-500"/> Guest Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* ✅ Auto-Filled Inputs */}
                   <input name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Name" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white" />
                   <input name="customerPhone" value={formData.customerPhone} onChange={handleChange} placeholder="Phone *" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white" />
                   <input name="customerEmail" value={formData.customerEmail} onChange={handleChange} placeholder="Email (Optional)" className="bg-black/50 border border-white/10 rounded-lg p-3 text-white col-span-2" />
                </div>
             </section>

             {/* Dining Info */}
             <section className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex gap-2"><UtensilsCrossed className="text-yellow-500"/> Dining Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="relative">
                      <label className="text-xs text-gray-500 uppercase block mb-2">Select Table *</label>
                      <div className="relative">
                        <Armchair className="absolute left-3 top-3 text-gray-500 w-5 h-5"/>
                        <select 
                            name="tableNumber" 
                            value={formData.tableNumber} 
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-10 text-white appearance-none focus:border-yellow-500 outline-none cursor-pointer"
                        >
                            <option value="">-- Choose Table --</option>
                            {tables.map(table => {
                                // ✅ SMART LOGIC: 
                                // 1. Check ID from Backend
                                const ownerId = table.currentOwner 
                                    ? (typeof table.currentOwner === 'object' ? table.currentOwner._id : table.currentOwner) 
                                    : null;
                                const isBackendMatch = table.isOccupied && String(ownerId) === String(myIdentity);
                                
                                // 2. Check LocalStorage (Fallback agar backend sync na ho)
                                const isLocalMatch = String(table.tableNumber) === String(savedActiveTable);

                                // 3. Combine Logic
                                const isMyTable = isBackendMatch || isLocalMatch;
                                const isSelectable = !table.isOccupied || isMyTable;

                                let label = `Table ${table.tableNumber} (${table.capacity} Seats)`;
                                if (isMyTable) label += " - (Your Table)";
                                else if (table.isOccupied) label += " - Occupied";

                                return (
                                    <option 
                                        key={table._id} 
                                        value={table.tableNumber}
                                        disabled={!isSelectable}
                                        className={!isSelectable ? "text-gray-500 bg-gray-900" : "text-white bg-black"}
                                    >
                                        {label}
                                    </option>
                                );
                            })}
                        </select>
                      </div>
                   </div>
                   <div>
                      <label className="text-xs text-gray-500 uppercase block mb-2">Notes</label>
                      <input name="notes" value={formData.notes} onChange={handleChange} placeholder="Less spicy..." className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" />
                   </div>
                </div>
             </section>

             <section className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex gap-2"><Wallet className="text-yellow-500"/> Payment</h3>
                <div className="grid grid-cols-2 gap-4">
                   <label className={`cursor-pointer border rounded-xl p-4 flex gap-3 ${formData.paymentMethod === 'cash' ? 'bg-yellow-900/20 border-yellow-500' : 'border-white/10'}`}>
                      <input type="radio" name="paymentMethod" value="cash" checked={formData.paymentMethod === 'cash'} onChange={handleChange} className="accent-yellow-500" />
                      <span className="text-white font-bold">Cash</span>
                   </label>
                   <label className={`cursor-pointer border rounded-xl p-4 flex gap-3 ${formData.paymentMethod === 'razorpay' ? 'bg-yellow-900/20 border-yellow-500' : 'border-white/10'}`}>
                      <input type="radio" name="paymentMethod" value="razorpay" checked={formData.paymentMethod === 'razorpay'} onChange={handleChange} className="accent-yellow-500" />
                      <span className="text-white font-bold">Online</span>
                   </label>
                </div>
             </section>
          </div>

          <div className="lg:col-span-1">
              <div className="bg-[#0a0a0a]/80 border border-yellow-600/20 rounded-xl p-6 sticky top-24">
                 <h3 className="text-xl font-cinzel font-bold text-white mb-4 border-b border-white/10 pb-4">Bill Summary</h3>
                 <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                    {items.map(i => (
                       <div key={i.menuItemId} className="flex justify-between text-sm text-gray-400">
                          <span>{i.quantity}x {i.name}</span>
                          <span className="text-white">₹{i.total}</span>
                       </div>
                    ))}
                 </div>
                 <div className="space-y-2 border-t border-white/10 pt-4 mb-4">
                    <div className="flex justify-between text-gray-400 text-sm"><span>Item Total</span><span>₹{totalCartPrice}</span></div>
                    <div className="flex justify-between text-gray-400 text-sm"><span>GST (5%)</span><span>+ ₹{gstAmount}</span></div>
                    {discount > 0 && (
                       <div className="flex justify-between text-green-500 text-sm font-bold">
                          <span>Discount ({appliedCoupon})</span><span>- ₹{discount}</span>
                       </div>
                    )}
                 </div>
                 
                 {!appliedCoupon ? (
                    <div className="flex gap-2 mb-4">
                       <input name="couponCode" value={formData.couponCode} onChange={handleChange} placeholder="COUPON CODE" className="flex-1 bg-black border border-white/20 rounded p-2 text-xs text-white uppercase" />
                       <button onClick={handleApplyCoupon} disabled={couponLoading} className="bg-gray-800 text-yellow-500 px-3 rounded text-xs font-bold border border-gray-700">APPLY</button>
                    </div>
                 ) : (
                    <div className="flex justify-between items-center bg-green-900/20 border border-green-500/30 p-2 rounded mb-4">
                       <span className="text-xs text-green-400 font-bold flex gap-1"><CheckCircle size={14}/> Applied</span>
                       <button onClick={() => {setDiscount(0); setAppliedCoupon(null); setFormData({...formData, couponCode:''})}}><X size={16} className="text-gray-400"/></button>
                    </div>
                 )}

                 <div className="flex justify-between items-end border-t border-dashed border-yellow-600/30 py-4 mb-4">
                    <span className="text-gray-300 font-bold">Grand Total</span>
                    <span className="text-2xl font-bold text-yellow-500">₹{grandTotal}</span>
                 </div>

                 <button onClick={handlePlaceOrder} disabled={loading} className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg flex justify-center gap-2 transition-all">
                    {loading ? <Loader2 className="animate-spin" /> : (formData.paymentMethod === 'razorpay' ? `Pay ₹${grandTotal}` : 'Confirm Order')}
                 </button>
              </div>
          </div>
       </div>
    </div>
  );
};

export default Checkout;