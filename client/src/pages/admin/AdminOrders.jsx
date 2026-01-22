import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { 
  Search, Filter, Eye, CheckCircle, Clock, XCircle, ChefHat, Truck 
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const toast = useToast();

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

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Status Update
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/admin/update-status/${orderId}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Order marked as ${newStatus}`);
        fetchOrders(); // Refresh list to show updated status
      }
    } catch (error) {
      toast.error(error, "Failed to update status");
    }
  };

  // Helper for Status Badge Color
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
    <div className="space-y-6">
      
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Order Management</h2>
          <p className="text-gray-500 text-sm">Track and manage customer orders</p>
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
           <button onClick={fetchOrders} className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm">Refresh</button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#111625] border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#0b0f19] text-gray-500 uppercase font-bold text-xs border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Amount / Pay</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8">Loading Orders...</td></tr>
              ) : filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-white/5 transition-colors">
                  
                  {/* ID & Date */}
                  <td className="px-6 py-4">
                    <span className="text-yellow-500 font-mono font-bold">#{order.orderNumber?.slice(-6) || '---'}</span>
                    <div className="text-[10px] text-gray-600 mt-1">
                      {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>

                  {/* Customer Info */}
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{order.customerName || "Guest"}</div>
                    <div className="text-xs text-gray-500">Table {order.tableNumber}</div>
                  </td>

                  {/* Items Summary */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <span key={idx} className="text-xs text-gray-300">
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-[10px] text-gray-500">+{order.items.length - 2} more...</span>
                      )}
                    </div>
                  </td>

                  {/* Amount & Payment */}
                  <td className="px-6 py-4">
                    <div className="text-white font-bold">₹{order.billDetails?.finalAmount}</div>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      order.paymentStatus === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>

                  {/* Order Status Badge */}
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>

                  {/* Actions Dropdown */}
                  <td className="px-6 py-4 text-center">
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
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && !loading && (
            <div className="text-center py-10 text-gray-500">No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;