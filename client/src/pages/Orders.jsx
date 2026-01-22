import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrders } from "../redux/orderSlice";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  CheckCircle, 
  ChefHat, 
  XCircle, 
  ShoppingBag, 
  Calendar,
  Utensils
} from "lucide-react";

const getStatusBadge = (status) => {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    preparing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    served: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };
  
  const icons = {
    pending: <Clock className="w-3 h-3" />,
    preparing: <ChefHat className="w-3 h-3" />,
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

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  // Logic to calculate breakdown
  const getBillBreakdown = (order) => {
    let finalAmount = 0;
    let taxAmount = 0;
    let subTotal = 0;

    // 1. Try to get exact data from Backend BillDetails
    if (order.billDetails && order.billDetails.finalAmount) {
        finalAmount = order.billDetails.finalAmount;
        taxAmount = order.billDetails.taxAmount || 0;
        subTotal = order.billDetails.subTotal || (finalAmount - taxAmount);
    } 
    // 2. Fallback Calculation
    else {
        // Sum up item prices
        const rawTotal = order.items.reduce((acc, item) => {
            const price = item.price || item.menuItemId?.price || 0;
            return acc + (price * item.quantity);
        }, 0);

        // Assume rawTotal is subTotal, add 5% GST
        subTotal = rawTotal;
        taxAmount = Math.round(subTotal * 0.05);
        finalAmount = subTotal + taxAmount;
    }

    return { subTotal, taxAmount, finalAmount };
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-yellow-500">Loading orders...</div>;

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Utensils className="w-10 h-10 text-gray-500" />
        </div>
        <h2 className="text-2xl font-cinzel font-bold text-white mb-2">No Orders Yet</h2>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded-lg mt-4">Start Ordering</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4 pt-6 font-manrope">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-yellow-900/20 rounded-full border border-yellow-600/30">
            <ShoppingBag className="w-6 h-6 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-cinzel font-bold text-white">Your Orders</h1>
      </div>

      <div className="space-y-6">
        {orders.map((order) => {
          const { subTotal, taxAmount, finalAmount } = getBillBreakdown(order);

          return (
            <div key={order._id} className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-yellow-600/30 transition-all duration-300">
              
              {/* Header */}
              <div className="bg-white/5 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-white/5">
                  <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Order ID</span>
                      <span className="text-yellow-500 font-mono text-sm">#{order.orderNumber || order._id.slice(-6)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      {getStatusBadge(order.orderStatus || 'pending')}
                  </div>
              </div>

              {/* Content */}
              <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                      
                      {/* Left: Items List */}
                      <div className="flex-1 space-y-3">
                          {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-3">
                                      <span className="bg-white/10 text-white w-6 h-6 flex items-center justify-center rounded text-xs font-bold">
                                          {item.quantity}x
                                      </span>
                                      <span className="text-gray-300">
                                          {item.name || (item.menuItemId ? item.menuItemId.name : "Item Unavailable")}
                                      </span>
                                  </div>
                                  <span className="text-gray-500 font-medium">
                                      ₹{(item.price || item.menuItemId?.price || 0) * item.quantity}
                                  </span>
                              </div>
                          ))}
                      </div>

                      {/* Right: Bill Summary Box (Updated for GST) */}
                      <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                          
                          <div className="flex justify-between text-sm text-gray-400 mb-1">
                              <span>Payment</span>
                              <span className="uppercase text-xs font-bold text-gray-300">{order.paymentMethod}</span>
                          </div>

                          {/* Break line */}
                          <div className="my-2 border-b border-white/5"></div>

                          {/* Subtotal */}
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Item Total</span>
                              <span>₹{subTotal}</span>
                          </div>

                          {/* GST */}
                          <div className="flex justify-between text-xs text-gray-400 mb-2">
                              <span>GST (5%)</span>
                              <span>+ ₹{taxAmount}</span>
                          </div>

                          {/* Final Total */}
                          <div className="flex justify-between items-end border-t border-white/10 pt-2">
                              <span className="text-sm font-bold text-gray-200">Total</span>
                              <span className="text-xl font-bold text-yellow-500">₹{finalAmount}</span>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;