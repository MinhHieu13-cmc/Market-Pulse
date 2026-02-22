import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  BarChart2, 
  ShieldAlert, 
  Zap, 
  FileText,
  Command,
  X,
  Upload
} from 'lucide-react';

interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ isOpen, onClose, onSelectAction }) => {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose(); // This is a bit counter-intuitive but index.tsx will handle the toggle
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'crypto', name: 'Start Crypto Analysis', icon: <TrendingUp size={18} className="text-fintech-up" />, description: 'Analyze market trends for BTC, ETH and more' },
    { id: 'stock', name: 'Start Stock Analysis', icon: <BarChart2 size={18} className="text-fintech-accent" />, description: 'Technical and fundamental analysis for stocks' },
    { id: 'backtest', name: 'Backtest Strategy', icon: <Zap size={18} className="text-yellow-500" />, description: 'Test your trading strategy on historical data' },
    { id: 'compare', name: 'Compare Assets', icon: <Search size={18} className="text-slate-400" />, description: 'Side-by-side comparison of multiple assets' },
    { id: 'report', name: 'Generate Market Report', icon: <FileText size={18} className="text-purple-500" />, description: 'Create a comprehensive PDF summary' },
    { id: 'upload', name: 'Upload Knowledge Base', icon: <Upload size={18} className="text-fintech-accent" />, description: 'Add PDF/TXT documents for AI context' },
  ];

  const filteredActions = actions.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#1e293b]/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel animate-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-3 border-b border-white/5">
          <Search className="text-slate-400 mr-3" size={20} />
          <input 
            autoFocus
            type="text"
            placeholder="Search commands or analyze assets..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded border border-slate-700 bg-slate-800 text-[10px] text-slate-400 font-mono">
              ESC
            </kbd>
            <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-md text-slate-400">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Available Actions
          </div>
          {filteredActions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                onSelectAction(action.id);
                onClose();
              }}
              className="w-full flex items-center p-3 hover:bg-white/5 rounded-xl transition-all group text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mr-4 group-hover:bg-white/10 transition-colors">
                {action.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-fintech-accent transition-colors">
                  {action.name}
                </div>
                <div className="text-xs text-slate-500">{action.description}</div>
              </div>
            </button>
          ))}
          {filteredActions.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No commands found for "{search}"
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-white/5 bg-black/20 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><Command size={10} className="mr-1" /> K to search</span>
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <div className="font-bold text-fintech-accent">Market Pulse AI Pro</div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
