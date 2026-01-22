import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api'; // Ensure this points to your axios instance
import { ShoppingBag, Wallet, BookOpen, Users, ArrowRight, PlusCircle, Layers, CreditCard } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-yellow-500">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm">Overview of your restaurant performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={data?.stats?.totalOrders} icon={<ShoppingBag />} color="text-blue-400" />
        <StatCard title="Revenue" value={`₹${data?.stats?.totalRevenue}`} icon={<Wallet />} color="text-yellow-400" />
        <StatCard title="Menu Items" value={data?.stats?.totalMenu} icon={<BookOpen />} color="text-purple-400" />
        <StatCard title="Active Tables" value={data?.stats?.activeTables} icon={<Users />} color="text-green-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-[#111625] rounded-xl border border-gray-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Recent Orders</h3>
            <button onClick={() => navigate('/admin/orders')} className="text-sm text-yellow-500 flex items-center gap-1 hover:underline">
                View All <ArrowRight size={14}/>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs uppercase text-gray-500 border-b border-gray-800">
                <tr>
                    <th className="pb-3 pl-2">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                {data?.recentOrders?.map((order) => (
                    <tr key={order._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 pl-2 text-yellow-500 font-mono">#{order.orderNumber}</td>
                    <td className="py-4">
                        <div className="text-white">{order.customerName || "Guest"}</div>
                        <div className="text-xs">Table {order.tableNumber}</div>
                    </td>
                    <td className="py-4 font-bold text-white">₹{order.billDetails?.finalAmount}</td>
                    <td className="py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        order.orderStatus === 'served' ? 'bg-green-500/20 text-green-500' :
                        order.orderStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-blue-500/20 text-blue-500'
                        }`}>
                        {order.orderStatus}
                        </span>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#111625] rounded-xl border border-gray-800 p-6 h-fit">
          <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <QuickBtn label="Add New Menu Item" onClick={() => navigate('/admin/menu')} />
            <QuickBtn label="Manage Orders" onClick={() => navigate('/admin/orders')} />
            <QuickBtn label="Manage Tables" onClick={() => navigate('/admin/tables')} />
            <QuickBtn label="Create Coupon" onClick={() => navigate('/admin/coupons')} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-[#111625] p-6 rounded-xl border border-gray-800 flex items-center justify-between hover:border-gray-600 transition-colors">
    <div>
      <p className="text-gray-500 text-xs uppercase font-bold mb-2">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg bg-gray-800 ${color}`}>{icon}</div>
  </div>
);

const QuickBtn = ({ label, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 bg-[#0b0f19] rounded-lg text-gray-300 hover:text-white hover:border-yellow-500 border border-gray-800 transition-all group">
    <span className="font-medium">{label}</span>
    <ArrowRight size={16} className="text-gray-600 group-hover:text-yellow-500" />
  </button>
);

export default AdminDashboard;