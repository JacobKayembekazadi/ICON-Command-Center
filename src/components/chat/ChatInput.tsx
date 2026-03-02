import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4 border-t border-[#2d3548] bg-[#0A0E27]">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask AI about your data..."
        disabled={disabled}
        className="flex-1 bg-[#1a1f3a] border border-[#2d3548] rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#00D9FF] disabled:opacity-50"
      />
      <Button 
        type="submit" 
        size="sm" 
        disabled={!input.trim() || disabled}
        className="h-9 w-9 p-0 rounded-full"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};
