import React, { useState } from 'react';
import { User, Cpu, TrendingUp, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageItemProps {
  message: string;
  isAi: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isAi }) => {
  const [isThinkingOpen, setIsThinkingOpen] = useState(false);

  // Extract thinking steps and clean message
  const thinkingMatch = message.match(/<thinking>([\s\S]*?)<\/thinking>/g);
  const thinkingSteps = thinkingMatch ? thinkingMatch.map(m => m.replace(/<\/?thinking>/g, '')) : [];
  const cleanMessage = message.replace(/<thinking>[\s\S]*?<\/thinking>/g, '').trim();

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
          {isAi && thinkingSteps.length > 0 && (
            <div className="mb-4 border-l-2 border-slate-700 pl-4 py-1">
              <button 
                onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                className="flex items-center space-x-2 text-slate-500 hover:text-slate-400 transition-colors text-xs font-medium"
              >
                {isThinkingOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                <span>{isThinkingOpen ? 'Ẩn quá trình suy nghĩ' : `Đã suy nghĩ qua ${thinkingSteps.length} bước...`}</span>
                {!cleanMessage && <Loader2 size={12} className="animate-spin ml-2" />}
              </button>
              
              {isThinkingOpen && (
                <div className="mt-2 space-y-1">
                  {thinkingSteps.map((step, idx) => (
                    <div key={idx} className="text-[11px] text-slate-500 italic">
                      • {step}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="prose prose-invert prose-sm max-w-none">
            {isAi ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {cleanMessage}
              </ReactMarkdown>
            ) : (
              <div className="whitespace-pre-wrap">{message}</div>
            )}
          </div>
          
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
