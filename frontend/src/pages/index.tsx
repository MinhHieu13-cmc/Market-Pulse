import React, { useState } from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import Watchlist from '../components/Watchlist';
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
      // Add a placeholder AI message
      const aiMsgId = Date.now() + 1;
      const aiMsg: Message = { id: aiMsgId, text: "", isAi: true };
      setMessages(prev => [...prev, aiMsg]);

      let fullText = "";
      for await (const chunk of chatService.streamMessage(text)) {
        fullText += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMsgId ? { ...msg, text: fullText } : msg
          )
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMsg: Message = { 
        id: Date.now() + 1, 
        text: "Sorry, an error occurred while connecting to the server. Please check your network or try again later.", 
        isAi: true 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-fintech-bg text-slate-200 overflow-hidden font-sans">
      <Head>
        <title>Market Pulse Pro | Financial AI Assistant</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative sm:ml-64 h-full">
        {/* Header - Sticky */}
        <header className="h-16 border-b border-slate-800 bg-fintech-bg/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-fintech-up animate-pulse"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Analysis Mode</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Account Status</span>
              <span className="text-xs font-bold text-fintech-accent">Institutional Pro</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] font-bold">
              MP
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col relative overflow-hidden">
            <ChatWindow messages={messages} />
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </main>

          {/* Watchlist Panel */}
          <Watchlist />
        </div>
      </div>
    </div>
  );
}
