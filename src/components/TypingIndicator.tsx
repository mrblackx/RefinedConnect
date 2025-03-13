import { useEffect, useState } from 'react';

interface TypingIndicatorProps {
  typingUsers: Record<string, boolean>;
  usernames: Record<string, string>;
  darkMode?: boolean;
}

export default function TypingIndicator({ typingUsers, usernames, darkMode = true }: TypingIndicatorProps) {
  const [typingMessage, setTypingMessage] = useState<string>('');
  
  useEffect(() => {
    // Safety check for valid input
    if (!typingUsers || !usernames) {
      setTypingMessage('');
      return;
    }
    
    try {
      // Get the list of users currently typing
      const typingUserIds = Object.entries(typingUsers)
        .filter(([, isTyping]) => isTyping)
        .map(([userId]) => userId);
      
      if (typingUserIds.length === 0) {
        setTypingMessage('');
        return;
      }
      
      // Get usernames for typing users
      const typingUsernames = typingUserIds.map(id => usernames[id] || 'Someone');
      
      // Format the typing message based on how many users are typing
      if (typingUsernames.length === 1) {
        setTypingMessage(`${typingUsernames[0]} is typing...`);
      } else if (typingUsernames.length === 2) {
        setTypingMessage(`${typingUsernames[0]} and ${typingUsernames[1]} are typing...`);
      } else if (typingUsernames.length > 2) {
        setTypingMessage('Several people are typing...');
      }
    } catch (error) {
      console.error('Error processing typing status:', error);
      setTypingMessage('');
    }
  }, [typingUsers, usernames]);
  
  if (!typingMessage) {
    return null;
  }
  
  return (
    <div className={`px-5 py-2 text-xs flex items-center font-light ${
      darkMode 
        ? 'bg-[#212A31] text-[#9EB8BE] border-t border-[#2E3944]' 
        : 'bg-[#D3D9D4] text-[#546E73] border-t border-[#748D92]/30'
    } relative`}
    style={{
      backgroundImage: darkMode 
        ? `radial-gradient(#2A3641 0.4px, #212A31 0.4px)`
        : `radial-gradient(#C1C7C0 0.6px, #D3D9D4 0.6px)`,
      backgroundSize: '14px 14px',
      backgroundPosition: '0 0'
    }}>
      <div className="flex space-x-1 mr-2 overflow-hidden">
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${darkMode ? 'bg-[#124E66]' : 'bg-[#124E66]'} opacity-40`} />
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${darkMode ? 'bg-[#124E66]' : 'bg-[#124E66]'} opacity-60 delay-75`} />
        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${darkMode ? 'bg-[#124E66]' : 'bg-[#124E66]'} opacity-80 delay-150`} />
      </div>
      <span>{typingMessage}</span>
    </div>
  );
} 