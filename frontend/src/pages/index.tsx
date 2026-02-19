import React, { useState } from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import { chatService } from '../services/api';

interface Message {
  id: number;
  text: string;
  isAi: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMsg: Message = { id: Date.now(), text, isAi: false };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(text);
      const aiMsg: Message = { id: Date.now() + 1, text: response.response, isAi: true };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMsg: Message = { 
        id: Date.now() + 1, 
        text: "Xin lỗi, đã có lỗi xảy ra khi kết nối với máy chủ.", 
        isAi: true 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-chatgpt-main text-white overflow-hidden">
      <Head>
        <title>Market Pulse - Trợ lý tài chính AI</title>
      </Head>
      
      <Sidebar />
      
      <main className="flex-1 flex flex-col relative sm:ml-64 h-full">
        <ChatWindow messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}
