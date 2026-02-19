import React from 'react';
import { Plus, MessageSquare, LogOut, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 bg-chatgpt-sidebar flex flex-col p-2 text-white">
      <div className="flex items-center justify-between p-2 mb-4">
        <div className="flex items-center space-x-2 font-bold text-xl">
          <div className="w-8 h-8 bg-emerald-500 rounded-sm flex items-center justify-center text-white">
            M
          </div>
          <span>Market Pulse</span>
        </div>
      </div>

      <button className="flex items-center space-x-3 w-full p-3 mb-2 border border-white/20 rounded-md hover:bg-white/10 transition-colors text-sm">
        <Plus size={16} />
        <span>New Chat</span>
      </button>

      <div className="flex-1 overflow-y-auto space-y-1">
        <div className="p-3 flex items-center space-x-3 rounded-md bg-white/10 cursor-pointer text-sm">
          <MessageSquare size={16} />
          <span className="truncate">Thị trường Bitcoin hôm nay...</span>
        </div>
        <div className="p-3 flex items-center space-x-3 rounded-md hover:bg-white/5 cursor-pointer text-sm text-gray-300">
          <MessageSquare size={16} />
          <span className="truncate">Phân tích cổ phiếu AAPL</span>
        </div>
      </div>

      <div className="mt-auto border-t border-white/20 pt-2 space-y-1">
        <button className="flex items-center space-x-3 w-full p-3 rounded-md hover:bg-white/10 transition-colors text-sm">
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button className="flex items-center space-x-3 w-full p-3 rounded-md hover:bg-white/10 transition-colors text-sm">
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
