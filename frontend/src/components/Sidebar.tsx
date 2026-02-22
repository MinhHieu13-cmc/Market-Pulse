import React, { useEffect, useState } from 'react';
import { Plus, MessageSquare, BarChart2, Bitcoin, DollarSign, Activity, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { chatService } from '../services/api';

interface Session {
  session_id: string;
  title: string;
}

interface SidebarProps {
  currentSessionId?: string;
  onSessionSelect?: (sessionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSessionId, onSessionSelect }) => {
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated, currentSessionId]);

  const loadSessions = async () => {
    try {
      const data = await chatService.getSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleNewAnalysis = () => {
    const newSid = `session-${Date.now()}`;
    localStorage.setItem('mp_session_id', newSid);
    if (onSessionSelect) {
      onSessionSelect(newSid);
    } else {
      window.location.reload(); 
    }
  };

  const handleSelectSession = (sid: string) => {
    localStorage.setItem('mp_session_id', sid);
    if (onSessionSelect) {
      onSessionSelect(sid);
    }
  };

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-[#020617] flex flex-col border-r border-white/5 text-slate-300">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-fintech-accent rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Activity className="text-white" size={24} />
          </div>
          <h1 className="text-white font-bold text-xl tracking-tight">Market Pulse</h1>
        </div>

        <button 
          onClick={handleNewAnalysis}
          className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-white py-3 px-4 rounded-2xl transition-all font-bold border border-white/5 shadow-xl"
        >
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
            {sessions.map((s) => (
              <button 
                key={s.session_id}
                onClick={() => handleSelectSession(s.session_id)}
                className={`w-full flex items-center space-x-3 py-2 px-3 rounded-lg text-left truncate transition-all group ${
                  currentSessionId === s.session_id ? 'text-white bg-slate-800/50 border border-white/5' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <MessageSquare size={16} className={`${currentSessionId === s.session_id ? 'text-fintech-accent' : 'group-hover:text-fintech-accent'} shrink-0`} />
                <span className="text-sm truncate">{s.title}</span>
              </button>
            ))}
            {sessions.length === 0 && (
              <div className="px-3 py-2 text-xs text-slate-600 italic">No recent analysis</div>
            )}
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
