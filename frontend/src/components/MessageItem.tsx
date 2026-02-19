import React from 'react';
import { User, Cpu, TrendingUp } from 'lucide-react';

interface MessageItemProps {
  message: string;
  isAi: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isAi }) => {
  return (
    <div className={`flex w-full mb-6 ${isAi ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[85%] sm:max-w-[75%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isAi ? 'bg-fintech-accent mr-3' : 'bg-slate-700 ml-3'
        }`}>
          {isAi ? <Cpu size={18} className="text-white" /> : <User size={18} className="text-white" />}
        </div>
        
        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isAi 
            ? 'bg-fintech-card text-slate-200 rounded-tl-none border border-slate-700/50' 
            : 'bg-fintech-accent text-white rounded-tr-none'
        }`}>
          <div className="whitespace-pre-wrap">{message}</div>
          
          {isAi && (message.includes('BTC') || message.includes('Bitcoin')) && (
            <div className="mt-4 p-3 bg-slate-900/50 rounded-xl border border-slate-700 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Asset Analysis</div>
                <div className="text-lg font-bold text-white">BTC/USDT</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono text-fintech-up flex items-center justify-end">
                  <TrendingUp size={16} className="mr-1" />
                  $52,431.20
                </div>
                <div className="text-[10px] text-fintech-up font-bold">+2.45% (24h)</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
