import { useState, useEffect, FormEvent } from 'react';
import { User, Edit2Icon, CheckIcon, XIcon } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface UserProfileProps {
  userId: string;
  username: string;
  onUpdateUsername: (newUsername: string) => void;
  darkMode?: boolean;
  collapsed?: boolean;
}

export default function UserProfile({ 
  userId, 
  username, 
  onUpdateUsername, 
  darkMode = true,
  collapsed = false 
}: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const initials = getInitials(username || 'Anonymous User');

  // Update new username when username prop changes - ensure client-side safety
  useEffect(() => {
    setNewUsername(username);
  }, [username]);

  // Handle form submission to update username
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (newUsername.trim() && newUsername.trim() !== username) {
      onUpdateUsername(newUsername.trim());
    } else {
      setNewUsername(username); // Reset to current username if invalid
    }
    
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setNewUsername(username);
  };

  // If sidebar is collapsed, only show avatar
  if (collapsed) {
    return (
      <div className={`py-4 flex justify-center border-b ${
        darkMode ? 'border-[#2E3944] bg-[#1D252B]' 
        : 'border-[#748D92]/20 bg-[#E8EDE6]'
      }`}>
        <div 
          className={`flex items-center justify-center w-12 h-12 rounded-full font-light text-xs border ${
            'border-[#2E3944] bg-[#191F24] text-[#D3D9D4]'
          }`}
          title={username || 'Anonymous User'}
        >
          {username ? initials : <User className="w-5 h-5 text-[#D3D9D4]" />}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border-b ${darkMode 
      ? 'border-[#2E3944] bg-[#1D252B]' 
      : 'border-[#748D92]/20 bg-[#E8EDE6]'}`}>
      <div className="flex items-center">
        {/* User avatar */}
        <div 
          className={`flex items-center justify-center w-12 h-12 rounded-full mr-3 text-xs font-light border transition-colors duration-200 ${
            'border-[#2E3944] bg-[#191F24] text-[#D3D9D4]'
          }`}
        >
          {username ? initials : <User className="w-5 h-5 text-[#D3D9D4]" />}
        </div>
        
        {/* Username display or edit */}
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="flex mb-1">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter your username"
                autoFocus
                className={`flex-1 py-1 px-2 text-sm font-light border rounded-lg ${
                  darkMode 
                    ? 'border-[#2E3944] bg-[#212A31] text-[#D3D9D4] placeholder-[#748D92]' 
                    : 'border-[#748D92]/20 bg-[#F0F2EF] text-[#212A31] placeholder-[#748D92]'
                }`}
              />
            </div>
            <div className="flex space-x-1">
              <button 
                type="submit" 
                className={`py-1 px-2 text-xs transition-colors duration-200 rounded-lg ${
                  darkMode 
                    ? 'bg-[#124E66] text-[#D3D9D4] hover:bg-[#0E4258]' 
                    : 'bg-[#124E66] text-[#D3D9D4] hover:bg-[#0E4258]'
                }`}
              >
                Save
              </button>
              <button 
                type="button" 
                onClick={handleCancel} 
                className={`py-1 px-2 text-xs transition-colors duration-200 rounded-lg ${
                  darkMode 
                    ? 'bg-[#2E3944]/70 text-[#9EB8BE] hover:bg-[#2E3944]' 
                    : 'bg-[#748D92]/10 text-[#546E73] hover:bg-[#748D92]/20'
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center flex-1">
            <div className="flex-1">
              <p className={`font-light ${darkMode ? 'text-[#D3D9D4]' : 'text-[#212A31]'}`}>{username || 'Anonymous User'}</p>
              <p className={`text-xs ${darkMode ? 'text-[#9EB8BE]' : 'text-[#546E73]'} font-light`}>ID: {userId.substring(0, 8)}...</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className={`p-1.5 rounded-full focus:outline-none transition-all duration-200 hover:scale-105 ${
                darkMode ? 'hover:bg-[#2E3944] text-[#9EB8BE]' : 'hover:bg-[#748D92]/10 text-[#546E73]'
              }`}
              aria-label="Edit username"
            >
              <Edit2Icon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 