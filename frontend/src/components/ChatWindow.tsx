import React from 'react';
import MessageItem from './MessageItem';
import { Activity, TrendingUp, BarChart2, ShieldAlert, Zap } from 'lucide-react';

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
        <div className="h-full flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="w-20 h-20 bg-gradient-to-br from-fintech-accent to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-900/40 relative">
            <Activity className="text-white" size={40} />
            <div className="absolute inset-0 bg-white/20 rounded-3xl animate-ping opacity-20"></div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Market Pulse AI</h1>
            <p className="text-slate-400 max-w-sm mx-auto font-medium">
              Institutional-grade analysis terminal. <br/>
              Powered by advanced quantitative models.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
            {[
              { text: 'Start Crypto Analysis', desc: 'Predict BTC & ETH trends', icon: <TrendingUp size={14} className="text-fintech-up" /> },
              { text: 'Start Stock Analysis', desc: 'AAPL, TSLA health check', icon: <BarChart2 size={14} className="text-fintech-accent" /> },
              { text: 'Risk Factors', desc: 'Identify market threats', icon: <ShieldAlert size={14} className="text-fintech-down" /> },
              { text: 'Trade Strategy', desc: 'Backtest quantitative setups', icon: <Zap size={14} className="text-yellow-500" /> },
            ].map((item) => (
              <button 
                key={item.text} 
                className="p-4 text-left glass-card rounded-2xl group transition-all"
              >
                <div className="flex items-center space-x-3 mb-1">
                  {item.icon}
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{item.text}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">{item.desc}</div>
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
