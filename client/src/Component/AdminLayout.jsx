import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { 
  LayoutDashboard, ClipboardList, UtensilsCrossed, 
  Armchair, Gift, LogOut, Menu as MenuIcon 
} from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/menu', label: 'Menu', icon: <UtensilsCrossed size={20} /> },
    { path: '/admin/orders', label: 'Orders', icon: <ClipboardList size={20} /> },
    { path: '/admin/tables', label: 'Tables', icon: <Armchair size={20} /> },
    { path: '/admin/coupons', label: 'Coupons', icon: <Gift size={20} /> },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Manrope:wght@300;400;500;600&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-manrope { font-family: 'Manrope', sans-serif; }
      `}</style>

      <div className="flex min-h-screen bg-[#0b0f19] font-manrope text-gray-300">
        
        {/* SIDEBAR */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col bg-[#050505] border-r border-gray-800 transition-all duration-300 sticky top-0 h-screen z-30`}>
          <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-800">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-900 to-black border border-yellow-600/40 flex items-center justify-center text-yellow-500 shrink-0">
              <UtensilsCrossed size={18} />
            </div>
            {isSidebarOpen && <span className="font-cinzel font-bold text-lg text-white">Savory Bites</span>}
          </div>

          <div className="flex-1 py-6 space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-4 px-6 py-3 border-l-4 transition-all ${
                  location.pathname === item.path 
                    ? 'border-yellow-500 bg-yellow-900/10 text-yellow-500' 
                    : 'border-transparent hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-gray-800">
            <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-2 hover:text-red-500 transition-colors w-full">
              <LogOut size={20} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-20 bg-[#050505] border-b border-gray-800 flex items-center justify-between px-8 sticky top-0 z-20">
             <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
                <MenuIcon />
             </button>
             <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-white">Admin User</p>
                    <p className="text-xs text-gray-500">Manager</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-yellow-500 font-bold">A</div>
             </div>
          </header>

          <div className="p-8 overflow-y-auto h-[calc(100vh-80px)]">
            <Outlet /> 
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;