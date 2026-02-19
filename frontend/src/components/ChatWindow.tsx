import React from 'react';
import MessageItem from './MessageItem';
import { Activity } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isAi: boolean;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto w-full pt-8 pb-40 px-4 sm:px-6 lg:px-8 custom-scrollbar">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 bg-fintech-accent/10 rounded-2xl flex items-center justify-center animate-pulse">
            <Activity className="text-fintech-accent" size={40} />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Market Pulse AI</h1>
            <p className="text-slate-500 max-w-sm">
              Your institutional-grade financial assistant. Ask about crypto trends, stock analysis, or market overview.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
            {['Predict BTC price for next 24h', 'Analyze AAPL stock health', 'Top crypto gainers today', 'VNIndex market sentiment'].map((suggestion) => (
              <button key={suggestion} className="p-3 text-left text-xs font-medium text-slate-400 bg-fintech-card/30 border border-slate-800 rounded-xl hover:bg-fintech-card/50 hover:border-fintech-accent/30 transition-all">
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg.text} isAi={msg.isAi} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
