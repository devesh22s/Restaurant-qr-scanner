import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders } from "../redux/orderSlice";
import { useNavigate } from "react-router-dom";
import { 
  Clock, CheckCircle, ChefHat, XCircle, ShoppingBag, 
  Calendar, Utensils, Percent, Filter
} from "lucide-react";

// Helper: Status Badge
const getStatusBadge = (status) => {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    preparing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    ready: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    served: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  
  const icons = {
    pending: <Clock className="w-3 h-3" />,
    preparing: <ChefHat className="w-3 h-3" />,
    ready: <ShoppingBag className="w-3 h-3" />,
    completed: <CheckCircle className="w-3 h-3" />,
    served: <CheckCircle className="w-3 h-3" />,
    cancelled: <XCircle className="w-3 h-3" />,
  };

  return (
    <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status?.toLowerCase()] || styles.pending}`}>
      {icons[status?.toLowerCase()] || <Clock className="w-3 h-3" />}
      {status}
    </span>
  );
};

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.orders);
  
  // ✅ NAYA STATE: Filter handle karne ke liye
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  const getBillBreakdown = (order) => {
    if (order.billDetails) {
        return {
            subTotal: order.billDetails.subTotal,
            discount: order.billDetails.discountAmount || 0,
            tax: order.billDetails.taxAmount,
            final: order.billDetails.finalAmount
        };
    } 
    else {
        const rawTotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const tax = Math.round(rawTotal * 0.05);
        return { subTotal: rawTotal, discount: 0, tax, final: rawTotal + tax };
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-yellow-500 font-cinzel animate-pulse">Fetching your orders...</div>;

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Utensils className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-2xl font-cinzel font-bold text-white mb-2">No Orders Yet</h2>
        <p className="text-gray-400 mb-6 font-manrope text-sm">Delicious food is just a click away.</p>
        <button onClick={() => navigate('/menu')} className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg shadow-lg hover:shadow-yellow-500/20 transition-all font-cinzel">Browse Menu</button>
      </div>
    );
  }

  // ✅ NAYA LOGIC: Orders ko filter karne ke liye
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Active") return ["pending", "preparing", "ready"].includes(order.orderStatus);
    if (activeFilter === "Past") return ["served", "completed", "cancelled"].includes(order.orderStatus);
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 pt-6 font-manrope">
      
      {/* Page Title & Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-900/20 rounded-full border border-yellow-600/30">
              <ShoppingBag className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
              <h1 className="text-3xl font-cinzel font-bold text-white">Your Orders</h1>
              <p className="text-xs text-yellow-600/70 uppercase tracking-widest font-bold mt-1">Track history & status</p>
          </div>
        </div>

        {/* ✅ FILTER TABS UI */}
        <div className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 p-1 rounded-lg self-start md:self-auto">
          {["All", "Active", "Past"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2
                ${activeFilter === tab 
                  ? "bg-yellow-600/20 text-yellow-500 border border-yellow-600/30" 
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent"
                }`}
            >
              {tab === "All" && <Filter className="w-3 h-3" />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ EMPTY STATE FOR FILTERS */}
      {filteredOrders.length === 0 ? (
        <div className="py-12 text-center bg-[#0a0a0a] border border-white/5 rounded-xl">
           <p className="text-gray-500 text-sm">No {activeFilter.toLowerCase()} orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const { subTotal, discount, tax, final } = getBillBreakdown(order);

            return (
              <div key={order._id} className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-yellow-600/30 transition-all duration-300 shadow-lg">
                
                {/* Card Header */}
                <div className="bg-white/5 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Order ID</span>
                        <span className="text-yellow-500 font-mono text-sm font-bold">#{order.orderNumber?.slice(-6) || '---'}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-400 text-xs bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString([], {day:'numeric', month:'short', year:'numeric'})}
                        </div>
                        {getStatusBadge(order.orderStatus || 'pending')}
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        
                        {/* Left: Items List */}
                        <div className="flex-1 space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm group">
                                    <div className="flex items-center gap-4">
                                        <span className="bg-white/5 text-white w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold border border-white/10">
                                            {item.quantity}x
                                        </span>
                                        <div>
                                            <span className="text-gray-200 font-medium block group-hover:text-yellow-500 transition-colors">
                                                {item.name || "Item Name"}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-gray-500 font-mono">
                                        ₹{(item.price || 0) * item.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Right: Bill Summary Box */}
                        <div className="w-full md:w-64 bg-white/[0.02] rounded-xl p-5 border border-white/5 flex flex-col justify-center">
                            
                            <div className="flex justify-between text-xs text-gray-400 mb-3">
                                <span className="uppercase tracking-wider font-bold">Payment Method</span>
                                <span className="text-white capitalize bg-blue-900/20 text-blue-300 px-2 py-0.5 rounded text-[10px] border border-blue-500/20">
                                    {order.paymentMethod}
                                </span>
                            </div>

                            <div className="space-y-2 pt-3 border-t border-dashed border-white/10">
                                {/* Subtotal */}
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Item Total</span>
                                    <span>₹{subTotal}</span>
                                </div>

                                {/* GST */}
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>GST (5%)</span>
                                    <span>+ ₹{tax}</span>
                                </div>

                                {/* DISCOUNT ROW (Conditional) */}
                                {discount > 0 && (
                                    <div className="flex justify-between text-xs text-green-400 font-bold bg-green-900/10 px-2 py-1 rounded">
                                        <span className="flex items-center gap-1"><Percent size={10}/> Discount</span>
                                        <span>- ₹{discount}</span>
                                    </div>
                                )}
                            </div>

                            {/* Final Total */}
                            <div className="flex justify-between items-end border-t border-white/10 pt-3 mt-3">
                                <span className="text-sm font-bold text-gray-200">Grand Total</span>
                                <span className="text-xl font-bold text-yellow-500 font-cinzel">₹{final}</span>
                            </div>
                        </div>

                    </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;