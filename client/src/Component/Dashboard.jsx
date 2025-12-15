import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Calendar, 
  Mail, 
  Search, 
  Bell, 
  Settings, 
  UtensilsCrossed, 
  MoreHorizontal,
  ArrowUpRight,
  Wallet,
  LogOut,
  Menu,
  ChefHat,
  Armchair,
  ClipboardList,
  PlusCircle,
  Clock,
  Wine
} from 'lucide-react';

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Manrope:wght@300;400;500;600&display=swap');
          .font-cinzel { font-family: 'Cinzel', serif; }
          .font-manrope { font-family: 'Manrope', sans-serif; }
          .gold-text-gradient { background: linear-gradient(to right, #FDE68A, #D4AF37, #FDE68A); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          
          /* Custom Scrollbar */
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #050505; }
          ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: #D4AF37; }
        `}
      </style>

      <div className="flex min-h-screen bg-[#020202] font-manrope text-gray-300 selection:bg-yellow-500/30">
        
        {/* === SIDEBAR === */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex flex-col bg-[#050505] border-r border-yellow-600/20 transition-all duration-300 sticky top-0 h-screen z-30`}>
          {/* Logo */}
          <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-900 to-black border border-yellow-600/40 flex items-center justify-center shadow-lg shrink-0">
              <UtensilsCrossed className="w-4 h-4 text-yellow-500" />
            </div>
            <span className={`font-cinzel font-bold text-lg gold-text-gradient whitespace-nowrap overflow-hidden transition-all duration-300 ${!isSidebarOpen && 'w-0 opacity-0'}`}>
              SavoryBites
            </span>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
            {/* Group 1: Operations */}
            <div>
              <p className={`text-[10px] uppercase tracking-widest text-gray-600 font-bold px-4 mb-4 ${!isSidebarOpen && 'text-center'}`}>
                {isSidebarOpen ? 'Operations' : '...'}
              </p>
              <div className="space-y-1">
                <NavItem icon={<LayoutDashboard />} label="Overview" active isOpen={isSidebarOpen} />
                <NavItem icon={<ClipboardList />} label="Live Orders" isOpen={isSidebarOpen} />
                <NavItem icon={<Calendar />} label="Reservations" isOpen={isSidebarOpen} />
                <NavItem icon={<Armchair />} label="Table Mgmt" isOpen={isSidebarOpen} />
              </div>
            </div>

            {/* Group 2: Kitchen & Menu */}
            <div>
              <p className={`text-[10px] uppercase tracking-widest text-gray-600 font-bold px-4 mb-4 ${!isSidebarOpen && 'text-center'}`}>
                {isSidebarOpen ? 'Kitchen' : '...'}
              </p>
              <div className="space-y-1">
                <NavItem icon={<UtensilsCrossed />} label="Menu Mgmt" isOpen={isSidebarOpen} />
                <NavItem icon={<ChefHat />} label="Kitchen Staff" isOpen={isSidebarOpen} />
                <NavItem icon={<Wine />} label="Inventory" isOpen={isSidebarOpen} />
              </div>
            </div>

            {/* Group 3: Finance */}
            <div>
              <p className={`text-[10px] uppercase tracking-widest text-gray-600 font-bold px-4 mb-4 ${!isSidebarOpen && 'text-center'}`}>
                {isSidebarOpen ? 'Finance' : '...'}
              </p>
              <div className="space-y-1">
                <NavItem icon={<Wallet />} label="Revenue" isOpen={isSidebarOpen} />
                <NavItem icon={<Users />} label="Customers" isOpen={isSidebarOpen} />
              </div>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="p-4 border-t border-white/5">
            <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
              <div className="w-9 h-9 rounded-full bg-yellow-900/20 border border-yellow-600/30 flex items-center justify-center text-yellow-500 font-bold font-cinzel">
                M
              </div>
              <div className={`overflow-hidden transition-all duration-300 ${!isSidebarOpen ? 'w-0 opacity-0' : 'w-auto'}`}>
                <p className="text-sm font-bold text-yellow-100">Manager</p>
                <p className="text-[10px] text-gray-500 uppercase">Admin Access</p>
              </div>
            </div>
            <div className={`mt-4 flex justify-between ${!isSidebarOpen && 'flex-col gap-4 items-center'}`}>
              <button className="text-gray-500 hover:text-yellow-500 transition-colors"><Settings className="w-4 h-4" /></button>
              <button className="text-gray-500 hover:text-red-400 transition-colors"><LogOut className="w-4 h-4" /></button>
            </div>
          </div>
        </aside>

        {/* === MAIN CONTENT === */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* Header */}
          <header className="h-20 bg-[#050505]/80 backdrop-blur-md border-b border-yellow-600/20 flex items-center justify-between px-6 sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-yellow-500 transition-colors hidden md:block">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="font-cinzel text-xl font-bold text-white hidden sm:block">Restaurant Overview</h1>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              {/* Quick Action Buttons (Desktop) */}
              <div className="hidden md:flex gap-3 mr-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-yellow-900/10 border border-yellow-600/30 rounded-lg text-yellow-500 text-xs font-bold uppercase tracking-wider hover:bg-yellow-600 hover:text-black transition-all">
                   <PlusCircle className="w-4 h-4" /> Add Menu Item
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-xs font-bold uppercase tracking-wider hover:border-yellow-500/50 hover:text-white transition-all">
                   <PlusCircle className="w-4 h-4" /> Add Table
                </button>
              </div>

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search orders, dishes..." 
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-yellow-600/50 w-64 transition-all"
                />
              </div>

              {/* Actions */}
              <button className="relative text-gray-400 hover:text-yellow-500 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
          </header>

          {/* Dashboard Body */}
          <div className="p-6 space-y-6 overflow-x-hidden">
            
            {/* 1. TOP STATS (Revenue & Operations) */}
            <div className="w-full bg-gradient-to-r from-gray-900 to-black rounded-2xl border border-yellow-600/20 p-6 md:p-8 relative overflow-hidden group">
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              <div className="relative z-10 mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-cinzel font-bold text-white mb-1">Today's Performance</h2>
                    <p className="text-sm text-gray-500">Live updates from floor and kitchen</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-xs text-yellow-600 uppercase tracking-widest font-bold">Kitchen Status</p>
                    <div className="flex items-center gap-2 justify-end mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-white font-bold">Smooth</span>
                    </div>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Main Revenue Card */}
                <div className="lg:col-span-1 bg-gradient-to-br from-[#BF953F] to-[#92400E] rounded-xl p-5 shadow-lg text-black transform hover:scale-105 transition-transform duration-300">
                  <h3 className="text-3xl font-bold font-manrope mb-1">₹84,343</h3>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80">Total Revenue</p>
                </div>

                {/* Sub Cards */}
                <StatCard amount="12" label="Pending Orders" percentage="High" color="text-red-400" />
                <StatCard amount="45" label="Tables Occupied" percentage="75%" color="text-yellow-400" />
                <StatCard amount="28" label="Reservations" percentage="Tonight" />
                <StatCard amount="₹1,250" label="Avg. Order Value" percentage="+5%" />
              </div>
            </div>

            {/* 2. CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Order Types (Dine-in vs Delivery) */}
              <Card title="Order Distribution" action>
                <div className="flex items-center justify-center py-6 relative">
                  {/* CSS/SVG Donut Chart */}
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      {/* Background Circle */}
                      <path className="text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" />
                      {/* Dine In Segment (Yellow) */}
                      <path className="text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" strokeDasharray="70, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" />
                      {/* Delivery Segment (White) */}
                      <path className="text-white" strokeDasharray="20, 100" strokeDashoffset="-75" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-white">150</span>
                      <span className="text-[10px] text-gray-500">Orders</span>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="ml-6 space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 mt-1 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]"></div>
                      <div>
                        <p className="text-sm font-bold text-white">70%</p>
                        <p className="text-[10px] text-gray-500">Dine-In</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 mt-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                      <div>
                        <p className="text-sm font-bold text-white">20%</p>
                        <p className="text-[10px] text-gray-500">Delivery</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Peak Hours (Bar Chart) */}
              <Card title="Peak Hours (Guests)" action>
                <div className="h-48 flex items-end justify-between px-2 gap-2 mt-4">
                   {[20, 40, 30, 85, 95, 60, 30].map((height, i) => (
                     <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                       <div 
                        className={`w-full rounded-t-sm transition-all duration-500 group-hover:opacity-100 ${i === 4 ? 'bg-gradient-to-t from-yellow-600 to-yellow-400 opacity-100 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-gray-800 opacity-50'}`} 
                        style={{ height: `${height}%` }}
                       ></div>
                       <span className="text-[9px] text-gray-500">{12 + i} PM</span>
                     </div>
                   ))}
                </div>
              </Card>

              {/* Weekly Sales Trend */}
              <Card title="Weekly Revenue" action>
                 <div className="relative h-40 mt-6 flex items-end">
                    {/* Gradient under curve */}
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/20 to-transparent clip-path-wave"></div>
                    
                    {/* SVG Line Chart */}
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                       <defs>
                          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                             <stop offset="0%" stopColor="#ca8a04" stopOpacity="0.5" />
                             <stop offset="50%" stopColor="#facc15" stopOpacity="1" />
                             <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.5" />
                          </linearGradient>
                       </defs>
                       <path 
                          d="M0 40 Q 20 30 40 20 T 80 15 T 120 10" 
                          fill="none" 
                          stroke="url(#goldGradient)" 
                          strokeWidth="2"
                          className="drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]"
                       />
                       <circle cx="80" cy="15" r="2" fill="#fff" />
                    </svg>

                    <div className="absolute top-1/4 right-1/4 transform text-center">
                       <div className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded shadow-lg mb-1">
                          ₹1.2L
                       </div>
                    </div>
                 </div>
                 <p className="text-center text-xs text-gray-500 mt-4">Highest revenue recorded on Saturday</p>
              </Card>
            </div>

            {/* 3. BOTTOM ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Floor Plan / Live Table Status */}
              <div className="lg:col-span-2 bg-[#0a0a0a] border border-yellow-600/20 rounded-xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                   <div>
                      <h3 className="text-lg font-cinzel font-bold text-white">Live Floor Status</h3>
                      <div className="flex items-center gap-4 mt-2">
                         <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-xs text-gray-500">Occupied</span></div>
                         <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-xs text-gray-500">Available</span></div>
                         <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500"></span><span className="text-xs text-gray-500">Reserved</span></div>
                      </div>
                   </div>
                   <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-white border border-gray-700 rounded px-3 py-1.5">
                      View Layout <ArrowUpRight className="w-3 h-3" />
                   </button>
                </div>
                
                {/* Visual Floor Plan Grid */}
                <div className="h-64 w-full bg-[#050505] rounded-lg border border-white/5 relative p-4">
                    <div className="grid grid-cols-6 gap-4 h-full">
                        {/* Generate Tables */}
                        {[...Array(12)].map((_, i) => {
                            // Mocking status logic
                            const status = i % 3 === 0 ? 'bg-red-500/20 border-red-500 text-red-500' : (i % 5 === 0 ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-green-500/20 border-green-500 text-green-500');
                            return (
                                <div key={i} className={`rounded-lg border border-dashed flex flex-col items-center justify-center cursor-pointer hover:opacity-80 transition-opacity ${status}`}>
                                    <span className="text-xs font-bold">T-{i+1}</span>
                                    <span className="text-[9px] opacity-70">{i % 3 === 0 ? '4/4' : '0/4'}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
              </div>

              {/* Signature Dishes / Popular Items */}
              <Card title="Signature Dishes" action>
                 <div className="space-y-5 mt-4">
                    <DishItem 
                       rank="1"
                       name="Truffle Risotto" 
                       sales="142 orders" 
                       price="₹1,200" 
                       borderColor="border-yellow-500"
                    />
                    <DishItem 
                       rank="2"
                       name="Wagyu Steak" 
                       sales="98 orders" 
                       price="₹3,500" 
                       borderColor="border-gray-400"
                    />
                    <DishItem 
                       rank="3"
                       name="Saffron Pasta" 
                       sales="85 orders" 
                       price="₹950" 
                       borderColor="border-yellow-700"
                    />
                     <DishItem 
                       rank="4"
                       name="Gold Leaf Dessert" 
                       sales="45 orders" 
                       price="₹1,500" 
                       borderColor="border-gray-800"
                    />
                 </div>
                 <button className="w-full mt-6 py-3 bg-gray-900 border border-yellow-600/20 text-yellow-500 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-yellow-600 hover:text-black transition-all">
                    View Full Menu Analytics
                 </button>
              </Card>

            </div>

          </div>
        </main>
      </div>
    </>
  );
};

// --- Reusable Sub-Components ---

const NavItem = ({ icon, label, active = false, isOpen }) => (
  <button className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group relative ${active ? 'text-yellow-500 bg-yellow-900/10' : 'text-gray-400 hover:text-yellow-100 hover:bg-white/5'} ${!isOpen && 'justify-center'}`}>
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-yellow-500 rounded-r-full"></div>}
    <span className="w-5 h-5">{icon}</span>
    {isOpen && <span className="font-medium text-sm">{label}</span>}
  </button>
);

const StatCard = ({ amount, label, percentage, color }) => (
  <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-4 hover:border-yellow-600/30 transition-all">
    <h3 className={`text-xl font-bold mb-1 ${color || 'text-white'}`}>{amount}</h3>
    <div className="flex justify-between items-center text-xs">
       <span className="text-gray-500">{label}</span>
       <span className="text-gray-400">({percentage})</span>
    </div>
  </div>
);

const Card = ({ title, action, children }) => (
  <div className="bg-[#0a0a0a] border border-yellow-600/20 rounded-xl p-6 relative flex flex-col h-full">
    <div className="flex justify-between items-start mb-2">
       <div>
          <h3 className="text-lg font-cinzel font-bold text-white">{title}</h3>
       </div>
       {action && (
          <button className="text-gray-500 hover:text-white">
             <MoreHorizontal className="w-5 h-5" />
          </button>
       )}
    </div>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

const DishItem = ({ rank, name, sales, price, borderColor }) => (
  <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
     <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs ${borderColor} text-gray-300`}>
           {rank}
        </div>
        <div>
           <p className="text-sm font-bold text-white group-hover:text-yellow-500 transition-colors">{name}</p>
           <p className="text-[10px] text-gray-500">{sales}</p>
        </div>
     </div>
     <span className="text-sm font-bold text-yellow-500/80">{price}</span>
  </div>
);

export default Dashboard;