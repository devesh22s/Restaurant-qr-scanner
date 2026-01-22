// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../lib/api'; // Custom API
// import { 
//   LayoutDashboard, 
//   ShoppingBag, 
//   Users, 
//   Calendar, 
//   Search, 
//   Bell, 
//   Settings, 
//   UtensilsCrossed, 
//   LogOut,
//   Menu,
//   ChefHat,
//   Armchair,
//   ClipboardList,
//   PlusCircle,
//   Wine,
//   Wallet,
//   ArrowRight
// } from 'lucide-react';
// import { useDispatch } from 'react-redux';
// import { logout } from '../redux/authSlice';

// const Dashboard = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const [stats, setStats] = useState({
//     totalRevenue: 0,
//     pendingOrders: 0,
//     completedOrders: 0,
//     activeTables: 0,
//     recentOrders: []
//   });
//   const [loading, setLoading] = useState(true);
  
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Fetch Live Data
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const res = await api.get('/orders/admin/stats');
//         if (res.data.success) {
//             setStats(res.data.stats);
//         }
//       } catch (error) {
//         console.error("Dashboard Error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
    
//     // Optional: Auto Refresh every 30 seconds
//     const interval = setInterval(fetchStats, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login');
//   };

//   // Status Color Helper
//   const getStatusColor = (status) => {
//     switch(status.toLowerCase()) {
//         case 'pending': return 'text-yellow-500 bg-yellow-500/10';
//         case 'preparing': return 'text-blue-500 bg-blue-500/10';
//         case 'served': return 'text-green-500 bg-green-500/10';
//         case 'cancelled': return 'text-red-500 bg-red-500/10';
//         default: return 'text-gray-500 bg-gray-500/10';
//     }
//   };

//   return (
//     <>
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Manrope:wght@300;400;500;600&display=swap');
//           .font-cinzel { font-family: 'Cinzel', serif; }
//           .font-manrope { font-family: 'Manrope', sans-serif; }
//           .gold-text-gradient { background: linear-gradient(to right, #FDE68A, #D4AF37, #FDE68A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
//           ::-webkit-scrollbar { width: 6px; }
//           ::-webkit-scrollbar-track { background: #050505; }
//           ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
//         `}
//       </style>

//       <div className="flex min-h-screen bg-[#020202] font-manrope text-gray-300 selection:bg-yellow-500/30">
        
//         {/* === SIDEBAR === */}
//         <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col bg-[#050505] border-r border-yellow-600/20 transition-all duration-300 sticky top-0 h-screen z-30`}>
//           {/* Logo */}
//           <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5 cursor-pointer" onClick={() => navigate('/')}>
//             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-900 to-black border border-yellow-600/40 flex items-center justify-center shadow-lg shrink-0">
//               <UtensilsCrossed className="w-4 h-4 text-yellow-500" />
//             </div>
//             <span className={`font-cinzel font-bold text-lg gold-text-gradient whitespace-nowrap overflow-hidden transition-all duration-300 ${!isSidebarOpen && 'w-0 opacity-0'}`}>
//               SavoryBites
//             </span>
//           </div>

//           {/* Navigation */}
//           <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
//             <div>
//               <p className={`text-[10px] uppercase tracking-widest text-gray-600 font-bold px-4 mb-4 ${!isSidebarOpen && 'text-center'}`}>
//                 {isSidebarOpen ? 'Operations' : '...'}
//               </p>
//               <div className="space-y-1">
//                 <NavItem icon={<LayoutDashboard />} label="Dashboard" active isOpen={isSidebarOpen} />
//                 <NavItem icon={<ClipboardList />} label="Live Orders" isOpen={isSidebarOpen} onClick={() => navigate('/orders')} />
//                 <NavItem icon={<Calendar />} label="Reservations" isOpen={isSidebarOpen} />
//                 <NavItem icon={<Armchair />} label="Tables" isOpen={isSidebarOpen} />
//               </div>
//             </div>

//             <div>
//               <p className={`text-[10px] uppercase tracking-widest text-gray-600 font-bold px-4 mb-4 ${!isSidebarOpen && 'text-center'}`}>
//                 {isSidebarOpen ? 'Kitchen' : '...'}
//               </p>
//               <div className="space-y-1">
//                 <NavItem icon={<UtensilsCrossed />} label="Menu Items" isOpen={isSidebarOpen} />
//                 <NavItem icon={<ChefHat />} label="Kitchen View" isOpen={isSidebarOpen} />
//               </div>
//             </div>
//           </div>

//           {/* User Profile */}
//           <div className="p-4 border-t border-white/5">
//             <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
//               <div className="w-9 h-9 rounded-full bg-yellow-900/20 border border-yellow-600/30 flex items-center justify-center text-yellow-500 font-bold font-cinzel">A</div>
//               <div className={`overflow-hidden transition-all duration-300 ${!isSidebarOpen ? 'w-0 opacity-0' : 'w-auto'}`}>
//                 <p className="text-sm font-bold text-yellow-100">Admin</p>
//                 <p className="text-[10px] text-gray-500 uppercase">Manager</p>
//               </div>
//             </div>
//             <div className={`mt-4 flex justify-between ${!isSidebarOpen && 'flex-col gap-4 items-center'}`}>
//               <button className="text-gray-500 hover:text-yellow-500 transition-colors"><Settings className="w-4 h-4" /></button>
//               <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors"><LogOut className="w-4 h-4" /></button>
//             </div>
//           </div>
//         </aside>

//         {/* === MAIN CONTENT === */}
//         <main className="flex-1 flex flex-col min-w-0">
          
//           {/* Header */}
//           <header className="h-20 bg-[#050505]/80 backdrop-blur-md border-b border-yellow-600/20 flex items-center justify-between px-6 sticky top-0 z-20">
//             <div className="flex items-center gap-4">
//               <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-yellow-500 transition-colors hidden md:block">
//                 <Menu className="w-5 h-5" />
//               </button>
//               <h1 className="font-cinzel text-xl font-bold text-white hidden sm:block">Admin Overview</h1>
//             </div>

//             <div className="flex items-center gap-6">
//               <div className="hidden md:flex gap-3">
//                  <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
//                     <input type="text" placeholder="Search..." className="bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-yellow-600/50 w-64 transition-all" />
//                  </div>
//               </div>
//               <button className="relative text-gray-400 hover:text-yellow-500 transition-colors">
//                 <Bell className="w-5 h-5" />
//                 <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
//               </button>
//             </div>
//           </header>

//           {/* Content Body */}
//           <div className="p-6 space-y-6 overflow-x-hidden">
            
//             {/* 1. TOP STATS CARDS */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 <div className="bg-gradient-to-br from-[#BF953F] to-[#92400E] rounded-xl p-5 shadow-lg text-black transform hover:scale-105 transition-transform duration-300">
//                   <h3 className="text-3xl font-bold font-manrope mb-1">₹{stats.totalRevenue.toLocaleString()}</h3>
//                   <p className="text-xs font-bold uppercase tracking-wider opacity-80 flex items-center gap-2">
//                     <Wallet className="w-3 h-3" /> Total Revenue
//                   </p>
//                 </div>

//                 <StatCard 
//                     amount={stats.pendingOrders} 
//                     label="Pending Orders" 
//                     icon={<ClipboardList className="w-4 h-4 text-yellow-500" />} 
//                     color="text-yellow-100" 
//                 />
                
//                 <StatCard 
//                     amount={stats.activeTables} 
//                     label="Tables Active" 
//                     icon={<Armchair className="w-4 h-4 text-blue-500" />} 
//                     color="text-blue-100" 
//                 />

//                 <StatCard 
//                     amount={stats.completedOrders} 
//                     label="Served Today" 
//                     icon={<ChefHat className="w-4 h-4 text-green-500" />} 
//                     color="text-green-100" 
//                 />
//             </div>

//             {/* 2. RECENT ORDERS TABLE (Matches Image) */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
//                 {/* Left: Orders Table */}
//                 <div className="lg:col-span-2 bg-[#0a0a0a] border border-yellow-600/20 rounded-xl p-6 relative">
//                     <div className="flex justify-between items-center mb-6">
//                         <h3 className="text-lg font-cinzel font-bold text-white">Recent Orders</h3>
//                         <button onClick={() => navigate('/orders')} className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1">
//                             View All <ArrowRight className="w-3 h-3" />
//                         </button>
//                     </div>

//                     <div className="overflow-x-auto">
//                         <table className="w-full text-left border-collapse">
//                             <thead>
//                                 <tr className="text-xs text-gray-500 uppercase border-b border-white/10">
//                                     <th className="py-3 pl-2">Order ID</th>
//                                     <th className="py-3">Customer / Table</th>
//                                     <th className="py-3">Amount</th>
//                                     <th className="py-3">Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="text-sm">
//                                 {loading ? (
//                                     <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
//                                 ) : stats.recentOrders.map((order) => (
//                                     <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
//                                         <td className="py-4 pl-2 font-mono text-yellow-500">#{order.orderNumber || order._id.slice(-6)}</td>
//                                         <td className="py-4 text-gray-300">
//                                             {order.customerName || "Guest"} 
//                                             <span className="text-xs text-gray-500 ml-2">(Table {order.tableNumber})</span>
//                                         </td>
//                                         <td className="py-4 font-bold">₹{order.billDetails?.finalAmount || 0}</td>
//                                         <td className="py-4">
//                                             <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${getStatusColor(order.orderStatus)}`}>
//                                                 {order.orderStatus}
//                                             </span>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Right: Quick Actions */}
//                 <div className="space-y-6">
//                     {/* Quick Actions Panel */}
//                     <div className="bg-[#0a0a0a] border border-yellow-600/20 rounded-xl p-6">
//                         <h3 className="text-lg font-cinzel font-bold text-white mb-4">Quick Actions</h3>
//                         <div className="space-y-3">
//                             <ActionButton label="Add New Menu Item" icon={<PlusCircle className="w-4 h-4" />} />
//                             <ActionButton label="Manage Orders" icon={<ClipboardList className="w-4 h-4" />} onClick={() => navigate('/orders')} />
//                             <ActionButton label="Manage Tables" icon={<Armchair className="w-4 h-4" />} />
//                         </div>
//                     </div>

//                     {/* Promo/Status Cards from Image */}
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="bg-[#111] border border-white/5 rounded-xl p-4 text-center">
//                             <h4 className="text-xl font-bold text-white mb-1">20% OFF</h4>
//                             <p className="text-[10px] text-gray-500">Active Coupon</p>
//                         </div>
//                         <div className="bg-[#111] border border-white/5 rounded-xl p-4 text-center">
//                             <h4 className="text-xl font-bold text-white mb-1">FREE</h4>
//                             <p className="text-[10px] text-gray-500"><span>Delivery  ₹500</span></p>
//                         </div>
//                     </div>
//                 </div>

//             </div>
//           </div>
//         </main>
//       </div>
//     </>
//   );
// };

// // Sub-Components
// const NavItem = ({ icon, label, active, isOpen, onClick }) => (
//   <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group relative ${active ? 'text-yellow-500 bg-yellow-900/10' : 'text-gray-400 hover:text-yellow-100 hover:bg-white/5'} ${!isOpen && 'justify-center'}`}>
//     <span className="w-5 h-5">{icon}</span>
//     {isOpen && <span className="font-medium text-sm">{label}</span>}
//   </button>
// );

// const StatCard = ({ amount, label, icon, color }) => (
//   <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 hover:border-yellow-600/30 transition-all">
//     <div className="flex justify-between items-start mb-2">
//         <h3 className={`text-2xl font-bold ${color || 'text-white'}`}>{amount}</h3>
//         <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
//     </div>
//     <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</p>
//   </div>
// );

// const ActionButton = ({ label, icon, onClick }) => (
//     <button onClick={onClick} className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-yellow-900/20 border border-white/10 hover:border-yellow-600/30 rounded-lg text-sm text-gray-300 hover:text-yellow-500 transition-all group">
//         <span className="flex items-center gap-3">{icon} {label}</span>
//         <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
//     </button>
// );

// export default Dashboard;