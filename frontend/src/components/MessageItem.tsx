import React, { useState } from 'react';
import { User, Cpu, TrendingUp, ChevronDown, ChevronUp, Loader2, ShieldAlert, Zap } from 'lucide-react';
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
  let cleanMessage = message.replace(/<thinking>[\s\S]*?<\/thinking>/g, '').trim();

  // Custom component for Markdown blocks
  const MarkdownComponents = {
    h3: ({ children }: any) => {
      const text = String(children);
      if (text.includes('Market Overview') || text.includes('📊')) {
        return <h3 className="flex items-center space-x-2 text-fintech-accent font-bold text-lg mb-4 mt-6 border-b border-white/5 pb-2 uppercase tracking-wider"><TrendingUp size={18} /><span>{children}</span></h3>;
      }
      if (text.includes('Risk Factors') || text.includes('⚠️')) {
        return <h3 className="flex items-center space-x-2 text-fintech-down font-bold text-lg mb-4 mt-6 border-b border-white/5 pb-2 uppercase tracking-wider"><ShieldAlert size={18} /><span>{children}</span></h3>;
      }
      if (text.includes('Trade Setup') || text.includes('💡')) {
        return <h3 className="flex items-center space-x-2 text-yellow-500 font-bold text-lg mb-4 mt-6 border-b border-white/5 pb-2 uppercase tracking-wider"><Zap size={18} /><span>{children}</span></h3>;
      }
      return <h3 className="text-white font-bold text-lg mb-3 mt-6">{children}</h3>;
    },
    blockquote: ({ children }: any) => (
      <div className="bg-white/5 border-l-4 border-fintech-accent p-4 my-4 rounded-r-xl italic text-slate-300">
        {children}
      </div>
    ),
  };

  return (
    <div className={`flex w-full mb-8 ${isAi ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[90%] sm:max-w-[80%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${
          isAi ? 'bg-gradient-to-br from-fintech-accent to-blue-700 mr-4' : 'bg-slate-800 ml-4'
        }`}>
          {isAi ? <Cpu size={22} className="text-white" /> : <User size={22} className="text-white" />}
        </div>
        
        <div className={`p-6 rounded-3xl text-sm leading-relaxed glass-panel transition-all hover:border-white/20 ${
          isAi 
            ? 'text-slate-200 rounded-tl-none' 
            : 'bg-fintech-accent/20 text-white rounded-tr-none border-fintech-accent/30'
        }`}>
          {isAi && thinkingSteps.length > 0 && (
            <div className="mb-6 border-l-2 border-white/10 pl-4 py-1">
              <button 
                onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                className="flex items-center space-x-2 text-slate-500 hover:text-slate-400 transition-colors text-xs font-bold uppercase tracking-widest"
              >
                <div className="flex space-x-1 mr-2">
                  <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1 h-1 bg-slate-500 rounded-full animate-bounce delay-150"></div>
                </div>
                <span>{isThinkingOpen ? 'Hide Cognitive Process' : `AI reasoning active (${thinkingSteps.length} steps)`}</span>
                {isThinkingOpen ? <ChevronUp size={12} className="ml-1" /> : <ChevronDown size={12} className="ml-1" />}
                {!cleanMessage && <Loader2 size={12} className="animate-spin ml-2" />}
              </button>
              
              {isThinkingOpen && (
                <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
                  {thinkingSteps.map((step, idx) => (
                    <div key={idx} className="text-[11px] text-slate-500 italic flex items-start">
                      <span className="text-fintech-accent mr-2 font-mono">[{idx+1}]</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="prose prose-invert prose-slate max-w-none prose-headings:text-white prose-strong:text-fintech-accent prose-code:text-yellow-500">
            {isAi ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
              >
                {cleanMessage}
              </ReactMarkdown>
            ) : (
              <div className="whitespace-pre-wrap font-medium">{message}</div>
            )}
          </div>
          
          {isAi && (message.includes('BTC') || message.includes('Bitcoin')) && (
            <div className="mt-8 p-4 glass-card rounded-2xl flex items-center justify-between group cursor-pointer active:scale-[0.98]">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp size={20} className="text-orange-500" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Asset Detail</div>
                  <div className="text-lg font-bold text-white group-hover:text-fintech-accent transition-colors">BTC / USDT</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-mono text-fintech-up font-bold flex items-center justify-end">
                  $52,431.20
                </div>
                <div className="flex items-center justify-end space-x-1">
                  <TrendingUp size={12} className="text-fintech-up" />
                  <span className="text-[10px] text-fintech-up font-bold">+2.45% Today</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
