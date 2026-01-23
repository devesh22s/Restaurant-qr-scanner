import React, { useEffect, useState, useRef } from "react";
import api from "../../lib/api";
import { io } from "socket.io-client"; 
import { 
  Search, Filter, Eye, CheckCircle, Clock, XCircle, 
  ChefHat, Truck, X, Receipt, Banknote, Loader2, Phone // ✅ Added Phone Icon
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const toast = useToast();
  
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
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. SOCKET.IO ---
  useEffect(() => {
    fetchOrders();

    socketRef.current = io(import.meta.env.VITE_API_URL || "http://localhost:3000");

    socketRef.current.on("order", (payload) => {
      if (payload.type === 'NEW_ORDER') {
        setOrders((prev) => [payload.data, ...prev]);
        toast.success(`New Order #${payload.data.orderNumber.slice(-4)} Received! 🔔`);
      }
      
      if (payload.type === 'PAYMENT_SUCCESS') {
         setOrders((prev) => prev.map(o => 
            o._id === payload.orderId ? { ...o, paymentStatus: 'success' } : o
         ));
         if(selectedOrder && selectedOrder._id === payload.orderId) {
             setSelectedOrder(prev => ({...prev, paymentStatus: 'success'}));
         }
         toast.info("Payment Received! 💰");
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // --- 3. ACTIONS ---
  const handleStatusUpdate = async (orderId, newStatus) => {
    const oldOrders = [...orders];
    setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));

    try {
      const res = await api.put(`/orders/admin/update-status/${orderId}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Order marked as ${newStatus}`);
      }
    } catch (error) {
      setOrders(oldOrders); 
      toast.error(error,"Update failed");
    }
  };

  const handleMarkPaid = async (orderId) => {
    try {
        const res = await api.post('/orders/admin/mark-paid', { orderId });
        if(res.data.success) {
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, paymentStatus: 'success' } : o));
            if(selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder(prev => ({ ...prev, paymentStatus: 'success' }));
            }
            toast.success("Payment Verified! 💵");
        }
    } catch (error) {
        toast.error(error,"Failed to update payment");
    }
  };

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

  const filteredOrders = filter === "All" 
    ? orders 
    : orders.filter(o => o.orderStatus === filter.toLowerCase());

  return (
    <div className="space-y-6 relative pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             Kitchen Display
             <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
          </h2>
          <p className="text-gray-500 text-sm">Real-time order management</p>
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

      {/* TABLE */}
      <div className="bg-[#111625] border border-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#0b0f19] text-gray-500 uppercase font-bold text-xs border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Order #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10"><Loader2 className="animate-spin inline-block w-6 h-6 text-yellow-500"/></td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order._id} className={`transition-colors ${order.orderStatus === 'pending' ? 'bg-yellow-900/5' : 'hover:bg-white/5'}`}>
                  
                  {/* ID */}
                  <td className="px-6 py-4">
                    <span className="text-white font-mono font-bold">#{order.orderNumber?.slice(-4)}</span>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-1">
                       <Clock size={10}/> {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>

                  {/* Customer (Name + Phone Added) */}
                  <td className="px-6 py-4">
                    <div className="text-white font-bold">{order.customerName || "Guest"}</div>
                    
                    {/* ✅ Phone Display Here */}
                    {order.customerPhone && (
                        <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Phone size={10}/> {order.customerPhone}
                        </div>
                    )}

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
                        <span className="text-[10px] text-blue-400 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            +{order.items.length - 2} more...
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="px-6 py-4">
                    <div className="text-white font-bold mb-1">₹{order.billDetails?.finalAmount}</div>
                    
                    {order.paymentMethod === 'cash' && order.paymentStatus === 'pending' ? (
                        <button 
                            onClick={() => handleMarkPaid(order._id)}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pulse"
                        >
                            <Banknote size={12} /> Mark Paid
                        </button>
                    ) : (
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded inline-block ${
                            order.paymentStatus === 'success' 
                            ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                            : 'bg-red-900/30 text-red-400'
                        }`}>
                            {order.paymentStatus === 'success' ? 'PAID' : order.paymentStatus} ({order.paymentMethod})
                        </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
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
                            className="p-1.5 bg-gray-800 text-gray-300 rounded hover:text-white hover:bg-gray-700"
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
        {filteredOrders.length === 0 && !loading && <div className="text-center py-10 text-gray-500">No orders found.</div>}
      </div>

      {/* --- MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#111625] w-full max-w-lg rounded-2xl border border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-200">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-[#0b0f19] rounded-t-2xl">
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
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                    
                    {/* Items */}
                    <div className="space-y-3">
                        {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-white">{item.quantity}</div>
                                    <span className="text-gray-200 text-sm font-medium">{item.name}</span>
                                </div>
                                <span className="text-gray-400 text-sm">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    {/* Calculation */}
                    <div className="border-t border-dashed border-gray-700 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-400"><span>Subtotal</span><span>₹{selectedOrder.billDetails?.subTotal}</span></div>
                        <div className="flex justify-between text-gray-400"><span>Tax</span><span>+ ₹{selectedOrder.billDetails?.taxAmount}</span></div>
                        {selectedOrder.billDetails?.discountAmount > 0 && (
                            <div className="flex justify-between text-green-500"><span>Discount</span><span>- ₹{selectedOrder.billDetails?.discountAmount}</span></div>
                        )}
                        <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
                            <span>Total</span>
                            <span>₹{selectedOrder.billDetails?.finalAmount}</span>
                        </div>
                    </div>

                    {/* Customer Info Box (Added Phone here too) */}
                    <div className="grid grid-cols-2 gap-4 text-xs bg-black/20 p-4 rounded-lg">
                        <div>
                            <span className="text-gray-500 block">Customer</span> 
                            <span className="text-white font-bold">{selectedOrder.customerName}</span>
                        </div>
                        
                        {/* ✅ Phone Display Logic */}
                        <div>
                            <span className="text-gray-500 block">Phone</span> 
                            <span className="text-white">{selectedOrder.customerPhone || "N/A"}</span>
                        </div>

                        <div><span className="text-gray-500 block">Table</span> <span className="text-yellow-500 font-bold">#{selectedOrder.tableNumber}</span></div>
                        <div>
                            <span className="text-gray-500 block">Payment</span> 
                            <span className={`font-bold ${selectedOrder.paymentStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {selectedOrder.paymentStatus} ({selectedOrder.paymentMethod})
                            </span>
                        </div>
                        {selectedOrder.notes && (
                            <div className="col-span-2 mt-2 pt-2 border-t border-gray-700">
                                <span className="text-gray-500 block mb-1">Notes:</span>
                                <p className="text-yellow-200 italic">"{selectedOrder.notes}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-[#0b0f19] border-t border-gray-800 rounded-b-2xl flex justify-end gap-3">
                    
                    {selectedOrder.paymentMethod === 'cash' && selectedOrder.paymentStatus === 'pending' && (
                        <button 
                            onClick={() => handleMarkPaid(selectedOrder._id)}
                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
                        >
                            <Banknote size={16}/> Confirm Payment
                        </button>
                    )}
                    
                    <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Close</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;