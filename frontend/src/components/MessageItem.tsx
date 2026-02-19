import React from 'react';
import { User, Bot } from 'lucide-react';

interface MessageItemProps {
  message: string;
  isAi: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isAi }) => {
  return (
    <div className={`py-8 flex justify-center w-full ${isAi ? 'bg-chatgpt-ai' : 'bg-chatgpt-user'}`}>
      <div className="max-w-3xl w-full px-4 flex space-x-4">
        <div className={`w-8 h-8 rounded-sm flex-shrink-0 flex items-center justify-center text-white ${isAi ? 'bg-emerald-500' : 'bg-indigo-600'}`}>
          {isAi ? <Bot size={20} /> : <User size={20} />}
        </div>
        <div className="flex-1 space-y-2 overflow-hidden">
          <p className="text-gray-100 text-base leading-relaxed break-words whitespace-pre-wrap">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
