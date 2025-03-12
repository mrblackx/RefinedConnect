import { formatDate, getInitials, stringToColor } from '@/lib/utils';
import { type ChatMessage as ChatMessageType } from '@/lib/hooks/useSocket';

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
  darkMode?: boolean;
}

export default function ChatMessage({ message, isCurrentUser, darkMode = true }: ChatMessageProps) {
  // Handle missing or invalid message data
  if (!message || typeof message !== 'object') {
    return null;
  }

  const { username = 'Unknown', message: text = '', timestamp = new Date().toISOString() } = message;
  const formattedTime = formatDate(timestamp);
  const initials = getInitials(username);
  const avatarColor = darkMode ? '#FFF' : '#000';
  const avatarBgColor = darkMode ? '#222' : '#f5f5f5';

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-5 group`}>
      {!isCurrentUser && (
        <div 
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full mr-3 text-xs font-light border transition-transform hover:scale-105"
          style={{ 
            color: avatarColor, 
            backgroundColor: avatarBgColor,
            borderColor: darkMode ? '#333' : '#e0e0e0' 
          }}
        >
          {initials}
        </div>
      )}
      <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isCurrentUser && (
          <p className={`text-xs mb-1 font-light ${darkMode ? 'text-[#a0a0a0]' : 'text-[#767676]'}`}>{username}</p>
        )}
        <div 
          className={`py-3 px-4 rounded-2xl shadow-sm ${
            isCurrentUser 
              ? `${darkMode ? 'bg-white text-[#111111]' : 'bg-black text-white'}` 
              : darkMode
                ? 'bg-[#222222] text-white border border-[#333333]'
                : 'bg-[#f5f5f5] text-black border border-[#e0e0e0]'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words font-light">{text}</p>
        </div>
        <p className={`text-xs mt-1 px-1 transition-opacity duration-200 opacity-70 group-hover:opacity-100 ${
          darkMode
            ? 'text-[#a0a0a0]'
            : 'text-[#767676]'
        }`}>
          {formattedTime}
        </p>
      </div>
      {isCurrentUser && (
        <div 
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ml-3 text-xs font-light border"
          style={{ 
            color: avatarColor, 
            backgroundColor: avatarBgColor,
            borderColor: darkMode ? '#333' : '#e0e0e0' 
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
} 