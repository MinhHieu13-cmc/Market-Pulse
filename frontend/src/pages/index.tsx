import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import Watchlist from '../components/Watchlist';
import CommandCenter from '../components/CommandCenter';
import LiveDataPanel from '../components/LiveDataPanel';
import UploadModal from '../components/UploadModal';
import { chatService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Trash2, Plus } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isAi: boolean;
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, router]);

  const loadHistory = async (sid: string) => {
    try {
      const history = await chatService.getHistory(sid);
      const formattedMessages = history.map((h: any, index: number) => ({
        id: index,
        text: h.content,
        isAi: h.role === 'assistant'
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && isAuthenticated) {
      let sid = localStorage.getItem('mp_session_id');
      if (!sid) {
        sid = `session-${Date.now()}`;
        localStorage.setItem('mp_session_id', sid);
      }
      setSessionId(sid);
      loadHistory(sid);
    }
  }, [isAuthenticated]);

  const handleSessionSelect = (sid: string) => {
    setSessionId(sid);
    loadHistory(sid);
  };

  const handleNewAnalysis = () => {
    const newSid = `session-${Date.now()}`;
    localStorage.setItem('mp_session_id', newSid);
    setSessionId(newSid);
    setMessages([]);
  };

  const handleDeleteSession = async () => {
    if (!sessionId) return;
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử phiên này?')) {
      try {
        await chatService.deleteHistory(sessionId);
        setMessages([]);
        handleNewAnalysis(); // Start a fresh one
      } catch (error) {
        console.error("Failed to delete history:", error);
        alert('Xóa lịch sử thất bại');
      }
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSendMessage = async (text: string) => {
    if (!sessionId) return;
    const userMsg: Message = { id: Date.now(), text, isAi: false };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const aiMsgId = Date.now() + 1;
      const aiMsg: Message = { id: aiMsgId, text: "", isAi: true };
      setMessages(prev => [...prev, aiMsg]);

      let fullText = "";
      for await (const chunk of chatService.streamMessage(text, sessionId)) {
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

  const handleActionSelect = (actionId: string) => {
    if (actionId === 'upload') {
      setIsUploadModalOpen(true);
      return;
    }
    
    handleNewAnalysis();

    const actionMap: Record<string, string> = {
      'crypto': 'Analyze Top 5 Crypto Assets by Market Cap',
      'stock': 'Analyze current US Stock market trends',
      'backtest': 'Help me backtest a simple EMA cross strategy',
      'compare': 'Compare BTC vs ETH performance',
      'report': 'Generate a summary market report for today'
    };
    
    if (actionMap[actionId]) {
      setTimeout(() => handleSendMessage(actionMap[actionId]), 100);
    }
  };

  return (
    <div className="flex h-screen bg-fintech-bg text-slate-200 overflow-hidden font-sans selection:bg-fintech-accent/30">
      <Head>
        <title>Market Pulse Pro | Bloomberg-style AI Copilot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      
      <Sidebar currentSessionId={sessionId} onSessionSelect={handleSessionSelect} />
      
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        sessionId={sessionId} 
      />

      <div className="flex-1 flex flex-col relative sm:ml-64 h-full">
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-fintech-bg/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsCommandCenterOpen(true)}
              className="flex items-center space-x-2 bg-fintech-accent hover:bg-blue-600 text-white py-1.5 px-4 rounded-full transition-all font-bold text-xs shadow-lg shadow-blue-900/20 group"
            >
              <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
              <span>AI Command Center</span>
              <kbd className="ml-2 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono opacity-50">
                ⌘K
              </kbd>
            </button>
            
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-fintech-up animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Analysis Mode</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={handleDeleteSession}
              title="Delete Session"
              className="p-2 text-slate-500 hover:text-fintech-down transition-colors rounded-lg hover:bg-white/5"
            >
              <Trash2 size={18} />
            </button>
            <button 
              onClick={handleNewAnalysis}
              title="New Analysis"
              className="p-2 text-slate-500 hover:text-fintech-accent transition-colors rounded-lg hover:bg-white/5"
            >
              <Plus size={20} />
            </button>
            <div className="w-px h-6 bg-white/10 mx-2"></div>
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Pro Account</span>
              <span className="text-xs font-bold text-fintech-accent truncate max-w-[120px]">
                {user?.email || 'Institutional Pro'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-[10px] font-bold text-slate-300 uppercase tracking-wider"
            >
              Log out
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-fintech-bg to-fintech-bg">
            <ChatWindow messages={messages} />
            <ChatInput 
              onSendMessage={handleSendMessage} 
              onUploadClick={() => setIsUploadModalOpen(true)}
              isLoading={isLoading} 
            />
          </main>

          {/* Right Panel - Live Data */}
          <LiveDataPanel />
          
          {/* Watchlist on larger screens can be integrated or toggled, for now keep it hidden to avoid cluttering 2-panel layout or put it in sidebar */}
        </div>
      </div>

      <CommandCenter 
        isOpen={isCommandCenterOpen} 
        onClose={() => setIsCommandCenterOpen(false)} 
        onSelectAction={handleActionSelect}
      />
    </div>
  );
}
