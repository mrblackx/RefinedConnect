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
  const avatarColor = stringToColor(username);
  const avatarBgColor = '#191F24'; // Always use #191F24 for both light and dark modes

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-5 group`}>
      {!isCurrentUser && (
        <div 
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full mr-3 text-xs font-light border transition-transform hover:scale-105 shadow-sm"
          style={{ 
            color: '#D3D9D4', // Light text color for contrast with dark background
            backgroundColor: avatarBgColor,
            borderColor: darkMode ? '#2E3944' : '#748D92' 
          }}
        >
          {initials}
        </div>
      )}
      
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%] relative z-10`}>
        {!isCurrentUser && (
          <p className={`text-xs mb-1 font-light ${darkMode ? 'text-[#9EB8BE]' : 'text-[#546E73]'}`}>{username}</p>
        )}
        <div 
          className={`py-3 px-4 rounded-2xl shadow-sm inline-block ${
            isCurrentUser 
              ? `${darkMode ? 'bg-[#124E66] text-[#D3D9D4]' : 'bg-[#124E66] text-[#D3D9D4]'}` 
              : darkMode
                ? 'bg-[#2E3944] text-[#D3D9D4] border border-[#2E3944]'
                : 'bg-[#EBF0EA] text-[#212A31] border border-[#748D92]/30 shadow-md'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words font-light">{text}</p>
        </div>
        <p className={`text-xs mt-1 px-1 transition-opacity duration-200 opacity-70 group-hover:opacity-100 ${
          darkMode
            ? 'text-[#9EB8BE]'
            : 'text-[#546E73]'
        }`}>
          {formattedTime}
        </p>
      </div>
      {isCurrentUser && (
        <div 
          className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full ml-3 text-xs font-light border transition-transform hover:scale-105 shadow-sm"
          style={{ 
            color: '#D3D9D4', // Light text color for contrast with dark background
            backgroundColor: avatarBgColor,
            borderColor: darkMode ? '#2E3944' : '#748D92' 
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
} 