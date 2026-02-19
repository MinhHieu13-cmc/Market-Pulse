import React from 'react';
import MessageItem from './MessageItem';

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
    <div className="flex-1 overflow-y-auto w-full pt-4 pb-32">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center opacity-20">
          <h1 className="text-4xl font-bold mb-4">Market Pulse</h1>
          <p className="text-lg">Hỏi tôi bất cứ điều gì về thị trường tài chính</p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageItem key={msg.id} message={msg.text} isAi={msg.isAi} />
        ))
      )}
    </div>
  );
};

export default ChatWindow;
