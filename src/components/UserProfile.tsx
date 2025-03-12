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
        darkMode ? 'border-[#333333] bg-[#111111]' 
        : 'border-[#e0e0e0] bg-white'
      }`}>
        <div 
          className={`flex items-center justify-center w-12 h-12 rounded-full font-light text-xs border ${
            darkMode ? 'border-[#333333] bg-[#222222] text-white' : 'border-[#e0e0e0] bg-[#f5f5f5] text-black'
          }`}
          title={username || 'Anonymous User'}
        >
          {username ? initials : <User className="w-5 h-5" />}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border-b ${darkMode 
      ? 'border-[#333333] bg-[#111111]' 
      : 'border-[#e0e0e0] bg-white'}`}>
      <div className="flex items-center">
        {/* User avatar */}
        <div 
          className={`flex items-center justify-center w-12 h-12 rounded-full mr-3 text-xs font-light border ${
            darkMode ? 'border-[#333333] bg-[#222222] text-white' : 'border-[#e0e0e0] bg-[#f5f5f5] text-black'
          }`}
        >
          {username ? initials : <User className="w-5 h-5" />}
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
                className={`flex-1 border py-2 px-3 text-sm focus:outline-none font-light rounded-l-2xl ${
                  darkMode 
                    ? 'border-[#333333] bg-[#222222] text-white placeholder-[#767676]' 
                    : 'border-[#e0e0e0] bg-white text-black placeholder-[#a0a0a0]'
                }`}
                maxLength={30}
              />
              <button
                type="submit"
                className={`${
                  darkMode ? 'bg-white text-[#111111]' : 'bg-black text-white'
                } py-2 px-3 text-sm transition-colors duration-200 font-light hover:opacity-90`}
              >
                <CheckIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className={`${
                  darkMode ? 'bg-[#333333] text-white' : 'bg-[#e0e0e0] text-black'
                } py-2 px-3 text-sm transition-colors duration-200 font-light rounded-r-2xl hover:opacity-90`}
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <p className={`text-xs ${darkMode ? 'text-[#a0a0a0]' : 'text-[#767676]'} font-light`}>Press Enter to save</p>
          </form>
        ) : (
          <div className="flex items-center flex-1">
            <div className="flex-1">
              <p className={`font-light ${darkMode ? 'text-white' : 'text-black'}`}>{username || 'Anonymous User'}</p>
              <p className={`text-xs ${darkMode ? 'text-[#a0a0a0]' : 'text-[#767676]'} font-light`}>ID: {userId.substring(0, 8)}...</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className={`p-1.5 rounded-full focus:outline-none transition-all duration-200 hover:scale-105 ${
                darkMode ? 'hover:bg-[#222222] text-[#a0a0a0]' : 'hover:bg-[#f5f5f5] text-[#767676]'
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