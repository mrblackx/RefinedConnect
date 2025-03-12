import { useState, useRef, useEffect, FormEvent } from 'react';
import { SendIcon } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
  darkMode?: boolean;
}

export default function ChatInput({ onSendMessage, onTyping, disabled = false, darkMode = true }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (message.trim() === '') return;
    
    try {
      onSendMessage(message);
      setMessage('');
      
      // Reset typing status
      onTyping(false);
      
      // Focus back on the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // You could add error handling UI here if needed
    }
  };

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Handle typing status with debounce
    onTyping(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a new timeout to stop showing typing indicator after 1 second of inactivity
    timeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1000);
  };

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  }, [message]);

  // Handle Enter key to send message (Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-end p-4 ${darkMode ? 'bg-[#111111]' : 'bg-white'} ${darkMode ? 'border-[#333333]' : 'border-[#e0e0e0]'} border-t`}>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          className={`w-full resize-none border rounded-2xl py-3 px-4 pr-14 focus:outline-none min-h-[48px] max-h-[150px] font-light text-sm ${
            darkMode 
              ? 'border-[#333333] bg-[#222222] text-white placeholder-[#767676]' 
              : 'border-[#e0e0e0] bg-white text-black placeholder-[#a0a0a0]'
          } transition-all duration-200 shadow-sm`}
          rows={1}
        />
        <div className="absolute right-3 top-[45%] transform -translate-y-1/2 flex items-center justify-center">
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={`${darkMode ? 'bg-white text-[#111111]' : 'bg-black text-white'} p-2 rounded-full focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out hover:scale-105 shadow-sm`}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
} 