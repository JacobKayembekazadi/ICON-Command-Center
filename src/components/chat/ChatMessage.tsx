import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'model';
  content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "flex max-w-[85%] rounded-2xl px-4 py-3 text-sm",
        isUser 
          ? "bg-[#00D9FF] text-[#0A0E27] rounded-br-none" 
          : "bg-[#1a1f3a] text-gray-100 border border-[#2d3548] rounded-bl-none"
      )}>
        {!isUser && <Bot className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />}
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {isUser && <User className="w-4 h-4 ml-2 mt-1 flex-shrink-0" />}
      </div>
    </div>
  );
};
