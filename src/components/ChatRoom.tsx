import { useRef, useEffect, useState } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { ChatMessage as ChatMessageType } from '@/lib/hooks/useSocket';
import { generateId } from '@/lib/utils';

interface ChatRoomProps {
  messages: ChatMessageType[];
  typingUsers: Record<string, boolean>;
  usernames: Record<string, string>;
  currentUserId: string;
  currentRoom: string | null;
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
}

export default function ChatRoom({
  messages,
  typingUsers,
  usernames,
  currentUserId,
  currentRoom,
  onSendMessage,
  onTyping,
  darkMode = true,
}: ChatRoomProps & { darkMode?: boolean }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current && isAtBottom) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle scroll events to determine if user has scrolled up
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesContainerRef.current) return;
      
      try {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        // Consider "at bottom" if within 100px of the bottom
        const isBottom = scrollHeight - scrollTop - clientHeight < 100;
        setIsAtBottom(isBottom);
      } catch (error) {
        console.error('Error handling scroll:', error);
        // Default to true on error to ensure messages are scrolled
        setIsAtBottom(true);
      }
    };
    
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Handle sending a message
  const handleSendMessage = (message: string) => {
    try {
      if (typeof onSendMessage === 'function') {
        onSendMessage(message);
      } else {
        console.error('onSendMessage is not a function');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Show empty state when no room is selected
  if (!currentRoom) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${
        darkMode 
          ? 'bg-[#111111] text-white' 
          : 'bg-white text-black'
      }`}>
        <div className="text-center p-6 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center border border-gray-200 dark:border-[#333333]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className={`text-xl mb-2 font-light ${darkMode ? 'text-white' : 'text-black'}`}>
            Welcome to RefinedConnect
          </h3>
          <p className={`${darkMode ? 'text-[#a0a0a0]' : 'text-[#767676]'} text-sm`}>
            Select a room from the sidebar or create a new one to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className={`border-b py-4 px-6 shadow-sm ${
        darkMode 
          ? 'border-[#333333] bg-[#111111] text-white' 
          : 'border-[#e0e0e0] bg-white text-black'
      }`}>
        <h2 className="text-lg font-light flex items-center tracking-tight">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          {currentRoom}
        </h2>
      </div>
      
      {/* Messages area */}
      <div 
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto p-5 space-y-4 ${
          darkMode 
            ? 'bg-[#111111]' 
            : 'bg-white'
        }`}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className={`text-center p-6 border ${
              darkMode 
                ? 'text-[#a0a0a0] bg-[#111111] border-[#333333]' 
                : 'text-[#767676] bg-white border-[#e0e0e0]'
            }`}>
              No messages yet. Be the first to send a message.
            </p>
          </div>
        ) : (
          <div className="space-y-4 font-light">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isCurrentUser={message.userId === currentUserId}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}
        
        {/* This div is used to scroll to the bottom */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Typing indicator */}
      <TypingIndicator 
        typingUsers={typingUsers} 
        usernames={usernames}
        darkMode={darkMode} 
      />
      
      {/* Message input area */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        onTyping={onTyping}
        darkMode={darkMode}
      />
    </div>
  );
} 