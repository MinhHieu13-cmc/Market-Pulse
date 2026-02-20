import React from 'react';
import { Plus, MessageSquare, BarChart2, Bitcoin, DollarSign, Activity, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-fintech-sidebar flex flex-col border-r border-slate-800 text-slate-300">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-fintech-accent rounded-lg flex items-center justify-center">
            <Activity className="text-white" size={20} />
          </div>
          <h1 className="text-white font-bold text-lg tracking-tight">Market Pulse AI</h1>
        </div>

        <button className="w-full flex items-center justify-center space-x-2 bg-fintech-accent hover:bg-blue-600 text-white py-2.5 px-4 rounded-xl transition-all font-medium shadow-lg shadow-blue-900/20">
          <Plus size={18} />
          <span>New Analysis</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6 custom-scrollbar">
        <div>
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3 px-2">Quick Filters</h3>
          <div className="space-y-1">
            <button className="w-full flex items-center space-x-3 text-slate-400 hover:bg-slate-800/50 hover:text-white py-2 px-3 rounded-lg transition-all group">
              <Bitcoin size={16} className="group-hover:text-fintech-up" />
              <span className="text-sm font-medium">Crypto</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-slate-400 hover:bg-slate-800/50 hover:text-white py-2 px-3 rounded-lg transition-all group">
              <BarChart2 size={16} className="group-hover:text-fintech-accent" />
              <span className="text-sm font-medium">Stocks</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-slate-400 hover:bg-slate-800/50 hover:text-white py-2 px-3 rounded-lg transition-all group">
              <DollarSign size={16} className="group-hover:text-yellow-500" />
              <span className="text-sm font-medium">Forex</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3 px-2">Recent Analysis</h3>
          <div className="space-y-1">
            <button className="w-full flex items-center space-x-3 text-white bg-slate-800/50 py-2 px-3 rounded-lg text-left truncate">
              <MessageSquare size={16} className="text-fintech-accent shrink-0" />
              <span className="text-sm truncate">BTC Trend Prediction</span>
            </button>
            <button className="w-full flex items-center space-x-3 text-slate-400 hover:bg-slate-800/50 hover:text-white py-2 px-3 rounded-lg text-left truncate group">
              <MessageSquare size={16} className="group-hover:text-fintech-accent shrink-0" />
              <span className="text-sm truncate">VNIndex Overview</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-1">
        <button className="w-full flex items-center space-x-3 text-slate-400 hover:bg-slate-800/50 hover:text-white py-2 px-3 rounded-lg transition-all">
          <Settings size={16} />
          <span className="text-sm">Settings</span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 text-slate-400 hover:bg-slate-800/50 hover:text-white py-2 px-3 rounded-lg transition-all"
        >
          <LogOut size={16} />
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
