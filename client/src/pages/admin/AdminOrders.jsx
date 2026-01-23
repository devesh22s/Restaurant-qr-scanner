import React, { useEffect, useState, useRef } from "react";
import api from "../../lib/api";
import { io } from "socket.io-client"; // ✅ Socket Import
import { 
  Search, Filter, Eye, CheckCircle, Clock, XCircle, ChefHat, Truck, X, Receipt 
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

// ✅ Sound File (Public folder me 'notification.mp3' rakh lena)
// const audio = new Audio('/notification.mp3'); 

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null); // For Modal
  const toast = useToast();
  
  // Socket Ref to prevent multiple connections
  const socketRef = useRef();

  // --- 1. FETCH ORDERS ---
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/admin/all-orders");
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. SOCKET.IO CONNECTION (Real-time) ---
  useEffect(() => {
    fetchOrders();

    // Connect to Backend URL
    socketRef.current = io(import.meta.env.VITE_API_URL || "http://localhost:3000");

    // Listen for New Orders
    socketRef.current.on("order", (payload) => {
      if (payload.type === 'NEW_ORDER') {
        // Add new order to top of list
        setOrders((prev) => [payload.data, ...prev]);
        toast.success(`New Order #${payload.data.orderNumber.slice(-4)} Received! 🔔`);
        
        // Play Sound
        // audio.play().catch(e => console.log("Audio play failed interaction needed"));
      }
      
      if (payload.type === 'PAYMENT_SUCCESS') {
         // Update payment status instantly
         setOrders((prev) => prev.map(o => 
            o._id === payload.orderId ? { ...o, paymentStatus: 'success' } : o
         ));
         toast.info("Payment Received for an order! 💰");
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // --- 3. UPDATE STATUS ---
  const handleStatusUpdate = async (orderId, newStatus) => {
    // Optimistic Update (UI pehle update karo)
    const oldOrders = [...orders];
    setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));

    try {
      const res = await api.put(`/orders/admin/update-status/${orderId}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Order marked as ${newStatus}`);
      }
    } catch (error) {
      setOrders(oldOrders); // Revert on error
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // Helper: Status Color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "preparing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "ready": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "served": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  
  // Filter Logic
  const filteredOrders = filter === "All" 
    ? orders 
    : orders.filter(o => o.orderStatus === filter.toLowerCase());

  return (
    <div className="space-y-6 relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             Order Management 
             <span className="text-xs bg-yellow-600 text-black px-2 py-0.5 rounded-full animate-pulse">Live</span>
          </h2>
          <p className="text-gray-500 text-sm">Real-time kitchen display system</p>
        </div>
        
        <div className="flex gap-3">
           <select 
             className="bg-[#111625] border border-gray-700 text-gray-300 rounded-lg px-4 py-2 text-sm focus:border-yellow-500 outline-none"
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
           >
             <option value="All">All Status</option>
             <option value="Pending">Pending</option>
             <option value="Preparing">Preparing</option>
             <option value="Ready">Ready</option>
             <option value="Served">Served</option>
           </select>
           <button onClick={fetchOrders} className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm transition-colors">
             Refresh
           </button>
        </div>
      </div>

      {/* --- ORDERS TABLE --- */}
      <div className="bg-[#111625] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#0b0f19] text-gray-500 uppercase font-bold text-xs border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer / Table</th>
                <th className="px-6 py-4">Items Summary</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10"><div className="animate-spin inline-block w-6 h-6 border-2 border-yellow-500 rounded-full border-t-transparent"></div></td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order._id} className={`transition-colors ${order.orderStatus === 'pending' ? 'bg-yellow-900/5 hover:bg-yellow-900/10' : 'hover:bg-white/5'}`}>
                  
                  {/* ID */}
                  <td className="px-6 py-4">
                    <span className="text-white font-mono font-bold">#{order.orderNumber?.slice(-4)}</span>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                       <Clock size={10}/> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div className="text-white font-bold">{order.customerName || "Walk-in"}</div>
                    <div className="text-xs text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded w-fit mt-1">
                        Table {order.tableNumber}
                    </div>
                  </td>

                  {/* Items */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <span key={idx} className="text-xs text-gray-300 flex justify-between max-w-[150px]">
                          <span>{item.name}</span>
                          <span className="text-gray-500">x{item.quantity}</span>
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-[10px] text-blue-400 cursor-pointer hover:underline" onClick={() => setSelectedOrder(order)}>
                            +{order.items.length - 2} more items...
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-6 py-4">
                    <div className="text-white font-bold">₹{order.billDetails?.finalAmount}</div>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
                      order.paymentStatus === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                    }`}>
                      {order.paymentMethod === 'cash' ? 'Cash' : 'Online'} - {order.paymentStatus}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                        <select 
                          className="bg-[#0b0f19] border border-gray-700 text-white text-xs rounded px-2 py-1.5 focus:border-yellow-500 outline-none cursor-pointer"
                          value={order.orderStatus}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="served">Served</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        
                        <button 
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500/20 transition-colors"
                            title="View Details"
                        >
                            <Eye size={16} />
                        </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && !loading && (
            <div className="text-center py-10 text-gray-500">No orders found matching filter.</div>
        )}
      </div>

      {/* --- ORDER DETAILS MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#111625] w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-[#0b0f19]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/10 rounded-full text-yellow-500"><Receipt size={20}/></div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Order Details</h3>
                            <p className="text-xs text-gray-500">#{selectedOrder.orderNumber}</p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white"><X size={20}/></button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    
                    {/* Items List */}
                    <div className="space-y-3">
                        {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-white">{item.quantity}</div>
                                    <span className="text-gray-200 text-sm font-medium">{item.name}</span>
                                </div>
                                <span className="text-gray-400 text-sm">₹{item.subTotal}</span>
                            </div>
                        ))}
                    </div>

                    {/* Bill Breakdown */}
                    <div className="border-t border-dashed border-gray-700 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{selectedOrder.billDetails.subTotal}</span></div>
                        <div className="flex justify-between text-gray-400"><span>Tax (5%)</span><span>+ ₹{selectedOrder.billDetails.taxAmount}</span></div>
                        {selectedOrder.billDetails.discountAmount > 0 && (
                            <div className="flex justify-between text-green-500"><span>Discount</span><span>- ₹{selectedOrder.billDetails.discountAmount}</span></div>
                        )}
                        <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
                            <span>Grand Total</span>
                            <span>₹{selectedOrder.billDetails.finalAmount}</span>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4 text-xs bg-black/20 p-4 rounded-lg">
                        <div><span className="text-gray-500 block">Customer</span> <span className="text-white">{selectedOrder.customerName}</span></div>
                        <div><span className="text-gray-500 block">Phone</span> <span className="text-white">{selectedOrder.customerPhone}</span></div>
                        <div><span className="text-gray-500 block">Table</span> <span className="text-yellow-500 font-bold">#{selectedOrder.tableNumber}</span></div>
                        <div><span className="text-gray-500 block">Payment</span> <span className="text-white capitalize">{selectedOrder.paymentMethod}</span></div>
                        {selectedOrder.notes && (
                            <div className="col-span-2 mt-2 pt-2 border-t border-gray-700">
                                <span className="text-gray-500 block mb-1">Chef Notes:</span>
                                <p className="text-yellow-200 italic">"{selectedOrder.notes}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-[#0b0f19] border-t border-gray-800 flex justify-end gap-3">
                    <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Close</button>
                    {selectedOrder.orderStatus !== 'served' && selectedOrder.orderStatus !== 'cancelled' && (
                        <button 
                            onClick={() => { handleStatusUpdate(selectedOrder._id, 'served'); setSelectedOrder(null); }}
                            className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg"
                        >
                            Mark as Served
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;