import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 sm:left-64 right-0 p-4 bg-gradient-to-t from-chatgpt-main via-chatgpt-main to-transparent">
      <form 
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto relative flex items-center bg-chatgpt-input rounded-xl shadow-2xl border border-white/10 p-1"
      >
        <button 
          type="button"
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <Paperclip size={20} />
        </button>
        
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
          placeholder="Hỏi Market Pulse về giá vàng, chứng khoán..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 py-3 px-2 resize-none max-h-40"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={`p-2 rounded-lg transition-colors mr-1 ${
            input.trim() && !isLoading 
              ? 'bg-emerald-600 text-white' 
              : 'bg-transparent text-gray-600 cursor-not-allowed'
          }`}
        >
          <Send size={18} />
        </button>
      </form>
      <p className="text-center text-[10px] text-gray-400 mt-2">
        Market Pulse có thể cung cấp thông tin sai lệch. Hãy kiểm tra các nguồn tin cậy.
      </p>
    </div>
  );
};

export default ChatInput;
