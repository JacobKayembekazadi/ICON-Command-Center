import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { chatWithAI } from '@/lib/gemini';
import { useLocation } from 'react-router-dom';
import { storage } from '@/lib/storage';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    // Gather context based on current page
    const contextData = {
      currentPage: location.pathname,
      products: storage.getProducts().slice(0, 20), // Limit context size
      orders: storage.getOrders().slice(0, 20),
      customers: storage.getCustomers().slice(0, 10),
      ads: storage.getAds(),
    };

    try {
      const response = await chatWithAI(text, contextData, newMessages);
      setMessages([...newMessages, { role: 'model', content: response }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'model', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#00D9FF] rounded-full shadow-lg flex items-center justify-center hover:bg-[#00b3d6] transition-all z-50 animate-bounce-subtle"
      >
        <MessageSquare className="w-7 h-7 text-[#0A0E27]" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 bg-[#0A0E27] border border-[#2d3548] rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 ${isMinimized ? 'w-72 h-14' : 'w-[400px] h-[600px]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2d3548] bg-[#1a1f3a] rounded-t-2xl">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-pulse" />
          <span className="font-semibold text-white">ICON AI Analyst</span>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-[#2d3548] rounded-lg text-gray-400 hover:text-white"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-[#2d3548] rounded-lg text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center mt-10 space-y-4">
                <div className="w-16 h-16 bg-[#1a1f3a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-[#00D9FF]" />
                </div>
                <h3 className="text-white font-medium">How can I help you?</h3>
                <div className="space-y-2">
                  {['Identify low stock risks', 'Analyze revenue trends', 'Suggest ad budget allocation'].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="block w-full text-sm bg-[#1a1f3a] hover:bg-[#2d3548] text-gray-300 py-2 px-4 rounded-lg transition-colors border border-[#2d3548]"
                    >
                      "{q}"
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} />
            ))}
            
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-400 text-sm ml-4">
                <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-[#00D9FF] rounded-full animate-bounce delay-150" />
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </>
      )}
    </div>
  );
};
