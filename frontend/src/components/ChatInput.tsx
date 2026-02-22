import React, { useState } from 'react';
import { Send, Paperclip, Clock } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onUploadClick: () => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onUploadClick, isLoading }) => {
  const [input, setInput] = useState('');
  const [timeframe, setTimeframe] = useState('1D');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 sm:left-64 xl:right-[400px] right-0 p-6 bg-gradient-to-t from-fintech-bg via-fintech-bg to-transparent z-20">
      <div className="max-w-4xl mx-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-end glass-panel rounded-3xl p-2 focus-within:border-fintech-accent/50 transition-all shadow-2xl"
        >
          <div className="flex flex-col space-y-2 p-1">
             <button 
              type="button"
              onClick={onUploadClick}
              className="p-2.5 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-xl"
              title="Upload PDF/TXT for RAG"
            >
              <Paperclip size={20} />
            </button>
            <div className="relative group">
              <button 
                type="button"
                className="p-2.5 text-fintech-accent hover:text-blue-400 transition-colors hover:bg-white/5 rounded-xl flex flex-col items-center"
              >
                <Clock size={18} />
                <span className="text-[8px] font-bold mt-0.5">{timeframe}</span>
              </button>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex flex-col glass-panel border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {['1H', '4H', '1D', '1W'].map(tf => (
                  <button 
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf)}
                    className={`px-4 py-2 text-[10px] font-bold hover:bg-white/5 transition-colors ${timeframe === tf ? 'text-fintech-accent' : 'text-slate-400'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Search markets or analyze assets (e.g. 'Analyze BTC trend')..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 py-4 px-4 resize-none max-h-40 text-sm font-medium"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-4 rounded-2xl transition-all m-1 shadow-lg ${
              input.trim() && !isLoading 
                ? 'bg-fintech-accent text-white hover:bg-blue-600 hover:shadow-blue-500/20 scale-105 active:scale-95' 
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
        <div className="flex items-center justify-center space-x-4 mt-3">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">
            Institutional Grade AI
          </p>
          <div className="h-1 w-1 rounded-full bg-slate-700"></div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">
            Real-time Market Feed
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
