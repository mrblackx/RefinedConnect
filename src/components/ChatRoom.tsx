import { useRef, useEffect, useState } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { ChatMessage as ChatMessageType } from '@/lib/hooks/useSocket';
import { generateId } from '@/lib/utils';
import { MessageSquare, Sparkles, LifeBuoy, Palette, Code, Globe, Users, Headphones, Sun, Moon, User, Settings, LogOut } from 'lucide-react';

// Map of icon names to components
const IconMap: Record<string, React.ElementType> = {
  'MessageSquare': MessageSquare,
  'Sparkles': Sparkles,
  'LifeBuoy': LifeBuoy,
  'Palette': Palette,
  'Code': Code,
  'Globe': Globe,
  'Users': Users,
  'Headphones': Headphones,
  // Default fallback
  'default': MessageSquare
};

interface ChatRoomProps {
  messages: ChatMessageType[];
  typingUsers: Record<string, boolean>;
  usernames: Record<string, string>;
  currentUserId: string;
  currentRoom: string | null;
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  roomIcon?: string;
}

export default function ChatRoom({
  messages,
  typingUsers,
  usernames,
  currentUserId,
  currentRoom,
  onSendMessage,
  onTyping,
  roomIcon = 'MessageSquare',
  darkMode = true,
  toggleTheme = () => {},
}: ChatRoomProps & { darkMode?: boolean; toggleTheme?: () => void }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);

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
          ? 'bg-[#212A31] text-[#D3D9D4]' 
          : 'bg-[#D3D9D4] text-[#212A31]'
      } relative`}
      style={{
        backgroundImage: darkMode 
          ? `radial-gradient(#3A4A5C 0.9px, #212A31 0.9px)`
          : `radial-gradient(#92A29B 0.9px, #D3D9D4 0.9px)`,
        backgroundSize: '20px 20px'
      }}>
        <div className="text-center p-6 max-w-md">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-xl flex items-center justify-center shadow-sm
               ${darkMode ? 'bg-[#124E66] text-[#D3D9D4]' : 'bg-[#124E66] text-[#D3D9D4]'}`}>
            <MessageSquare className="h-10 w-10" />
          </div>
          <h3 className={`text-xl mb-2 font-light font-serif ${darkMode ? 'text-[#D3D9D4]' : 'text-[#212A31]'}`}>
            Welcome to RefinedConnect
          </h3>
          <p className={`${darkMode ? 'text-[#748D92]' : 'text-[#748D92]'} text-sm`}>
            Select a room from the sidebar or create a new one to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${
      darkMode 
        ? 'border-l border-[#2E3944]'
        : 'border-l border-[#748D92]/20'
    }`}>
      {/* Chat header */}
      <div className={`border-b p-[21px] ${
        darkMode 
          ? 'border-[#2E3944] bg-[#191F24] text-[#D3D9D4]' 
          : 'border-[#748D92]/20 bg-[#DDE2D8] text-[#212A31]'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 mr-3 rounded-xl transition-transform ${
              darkMode ? 'bg-[#124E66] text-[#D3D9D4]' : 'bg-[#124E66] text-[#D3D9D4]'
            } shadow-sm`}>
              {(() => {
                const Icon = IconMap[roomIcon] || IconMap.default;
                return <Icon className="w-5 h-5" />;
              })()}
            </div>
            <h2 className="text-lg font-light tracking-tight">
              {currentRoom}
            </h2>
          </div>
          
          {/* User profile and dark mode toggle */}
          <div className="flex items-center gap-2">
            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={`p-2.5 rounded-2xl transition-all duration-200 hover:scale-105 shadow-sm bg-[#191F24] hover:bg-[#124E66]`}
              >
                <User className="w-5 h-5 text-[#748D92]" />
              </button>
              
              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-lg z-50 bg-[#191F24] border border-[#124E66]`}>
                  <div className="py-1">
                    <button
                      className={`flex items-center w-full px-4 py-3 text-sm text-[#D3D9D4] hover:bg-[#124E66] transition-colors duration-200`}
                    >
                      <User className="w-4 h-4 mr-3" />
                      My Profile
                    </button>
                    <button
                      className={`flex items-center w-full px-4 py-3 text-sm text-[#D3D9D4] hover:bg-[#124E66] transition-colors duration-200`}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                    <button
                      className={`flex items-center w-full px-4 py-3 text-sm text-[#D3D9D4] hover:bg-[#124E66] transition-colors duration-200`}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark mode toggle */}
            <div className={`relative inline-flex h-10 w-20 items-center rounded-2xl transition-colors duration-300 focus:outline-none shadow-sm ${darkMode ? 'bg-[#2E3944]' : 'bg-[#748D92]/30'}`}>
              <span className="sr-only">Toggle dark mode</span>
              <span className={`absolute left-1 flex h-8 w-8 items-center justify-center rounded-xl ${
                darkMode 
                  ? 'translate-x-10 bg-[#124E66] text-[#D3D9D4] shadow-sm' 
                  : 'translate-x-0 bg-[#D3D9D4] text-[#212A31] shadow-sm'
                } transform transition-all duration-300 hover:scale-105`}>
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </span>
              <span className={`absolute right-1 flex h-8 w-8 items-center justify-center rounded-xl ${
                !darkMode 
                  ? 'translate-x-0 bg-[#748D92]/20 text-[#212A31]' 
                  : '-translate-x-10 bg-[#212A31] text-[#748D92]'
                } transform transition-all duration-300 hover:scale-105`}>
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </span>
              <input
                type="checkbox"
                className="absolute h-full w-full cursor-pointer opacity-0"
                checked={darkMode}
                onChange={toggleTheme}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages area */}
      <div 
        ref={messagesContainerRef}
        className={`flex-1 overflow-y-auto p-5 space-y-4 ${
          darkMode 
            ? 'bg-[#212A31]' 
            : 'bg-[#F0F2EF]'
        } relative`}
        style={{
          backgroundImage: darkMode 
            ? `radial-gradient(#3A4A5C 0.9px, #212A31 0.9px)`
            : `radial-gradient(#A8B3A3 0.9px, #F0F2EF 0.9px)`,
          backgroundSize: '20px 20px'
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className={`text-center p-6 border rounded-2xl shadow-sm ${
              darkMode 
                ? 'text-[#748D92] bg-[#212A31] border-[#2E3944]' 
                : 'text-[#748D92] bg-[#EBF0EA] border-[#748D92]/30'
            } relative`}
            style={{
              backgroundImage: darkMode 
                ? `radial-gradient(#3A4A5C 0.8px, #212A31 0.8px)`
                : `radial-gradient(#92A29B 0.6px, #EBF0EA 0.6px)`,
              backgroundSize: '16px 16px'
            }}>
              No messages yet. Be the first to send a message.
            </p>
          </div>
        ) : (
          <div className="space-y-4 font-light relative z-10">
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