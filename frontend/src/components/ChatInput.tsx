import React, { useState } from 'react';
import { Send, Paperclip, Clock } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
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
    <div className="fixed bottom-0 left-0 sm:left-64 lg:right-80 right-0 p-6 bg-gradient-to-t from-fintech-bg via-fintech-bg to-transparent">
      <div className="max-w-4xl mx-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-end bg-fintech-input rounded-2xl shadow-2xl border border-slate-700/50 p-2 focus-within:border-fintech-accent transition-all"
        >
          <div className="flex flex-col space-y-2 p-1">
             <button 
              type="button"
              className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-slate-700/50 rounded-lg"
              title="Attach CSV/Data"
            >
              <Paperclip size={20} />
            </button>
            <div className="relative group">
              <button 
                type="button"
                className="p-2 text-fintech-accent hover:text-blue-400 transition-colors hover:bg-slate-700/50 rounded-lg flex flex-col items-center"
              >
                <Clock size={18} />
                <span className="text-[8px] font-bold mt-0.5">{timeframe}</span>
              </button>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex flex-col bg-fintech-card border border-slate-700 rounded-lg overflow-hidden shadow-xl">
                {['1H', '1D', '1W', '1M'].map(tf => (
                  <button 
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1.5 text-xs font-bold hover:bg-slate-700 ${timeframe === tf ? 'text-fintech-accent' : 'text-slate-400'}`}
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
            placeholder="Ask about BTC trend today, VNIndex prediction..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-200 placeholder-slate-500 py-3 px-3 resize-none max-h-40 text-sm"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl transition-all m-1 shadow-lg ${
              input.trim() && !isLoading 
                ? 'bg-fintech-accent text-white hover:bg-blue-600 scale-105 active:scale-95' 
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-500 mt-3 font-medium tracking-wide">
          FINANCIAL AI AGENT • MARKET PULSE PRO • DATA REFRESHED REAL-TIME
        </p>
      </div>
    </div>
  );
};

export default ChatInput;
