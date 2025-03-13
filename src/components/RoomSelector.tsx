import { useState } from 'react';
import { PlusIcon, Hash, MessageSquare, Sparkles, LifeBuoy, Palette, Code, Zap, Users, Headphones, Globe, PanelRight } from 'lucide-react';
import { generateId } from '@/lib/utils';

interface RoomSelectorProps {
  rooms: Array<{ id: string; name: string; icon?: string }>;
  currentRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onAddRoom: (room: { id: string; name: string }) => void;
  darkMode?: boolean;
  collapsed?: boolean;
}

// Map of icon names to components
const iconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  LifeBuoy: <LifeBuoy className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Headphones: <Headphones className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  PanelRight: <PanelRight className="w-5 h-5" />,
};

export default function RoomSelector({ 
  rooms, 
  currentRoomId, 
  onSelectRoom, 
  onAddRoom,
  darkMode = true,
  collapsed = false
}: RoomSelectorProps) {
  const [newRoomName, setNewRoomName] = useState('');
  const [isAddingRoom, setIsAddingRoom] = useState(false);

  // Handle creating a new room
  const handleCreateRoom = () => {
    if (newRoomName.trim() === '') return;
    
    const newRoom = {
      id: generateId(),
      name: newRoomName.trim(),
      icon: 'MessageSquare' // Default icon for new rooms
    };
    
    onAddRoom(newRoom);
    setNewRoomName('');
    setIsAddingRoom(false);
    onSelectRoom(newRoom.id);
  };

  // Handle key press in the new room input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateRoom();
    } else if (e.key === 'Escape') {
      setIsAddingRoom(false);
      setNewRoomName('');
    }
  };

  // Get the appropriate icon for a room
  const getRoomIcon = (iconName?: string) => {
    if (iconName && iconMap[iconName]) {
      return iconMap[iconName];
    }
    return <Hash className="w-5 h-5" />;
  };

  return (
    <div className="p-4 flex-1 overflow-auto">
      {!collapsed && (
        <div className="flex justify-between items-center mb-3">
          <h2 className={`text-lg font-light tracking-tight ${darkMode ? 'text-[#D3D9D4]' : 'text-[#212A31]'}`}>Rooms</h2>
          <button
            onClick={() => setIsAddingRoom(true)}
            className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200 ${
              darkMode 
                ? 'bg-[#124E66] text-[#D3D9D4] hover:bg-[#124E66]/90' 
                : 'bg-[#124E66] text-[#D3D9D4] hover:bg-[#124E66]/90'
            } shadow-sm hover:scale-105`}
            aria-label="Add new room"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {isAddingRoom && !collapsed && (
        <div className="mb-4">
          <div className="flex mb-1">
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter room name"
              autoFocus
              className={`flex-1 border py-2 px-3 text-sm focus:outline-none font-light rounded-l-2xl ${
                darkMode 
                  ? 'border-[#2E3944] bg-[#2E3944] text-[#D3D9D4] placeholder-[#748D92]' 
                  : 'border-[#748D92]/30 bg-[#748D92]/10 text-[#212A31] placeholder-[#748D92]'
              }`}
            />
            <button
              onClick={handleCreateRoom}
              disabled={!newRoomName.trim()}
              className={`${
                darkMode 
                  ? 'bg-[#124E66] text-[#D3D9D4]' 
                  : 'bg-[#124E66] text-[#D3D9D4]'
              } py-2 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out rounded-r-2xl font-light hover:opacity-90`}
            >
              Create
            </button>
          </div>
          <p className={`text-xs px-1 ${darkMode ? 'text-[#748D92]' : 'text-[#748D92]'} font-light`}>
            Press Enter to create or Escape to cancel
          </p>
        </div>
      )}
      
      <div className={`space-y-2 ${collapsed ? 'flex flex-col items-center' : ''}`}>
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={`${collapsed ? 'w-12 h-12 flex justify-center rounded-2xl' : 'w-full text-left rounded-2xl'} px-3 py-2.5 text-sm focus:outline-none transition-all duration-200 flex items-center font-light hover:scale-[1.02] ${
              currentRoomId === room.id 
                ? `${darkMode 
                    ? 'bg-[#124E66] text-[#D3D9D4]' 
                    : 'bg-[#124E66] text-[#D3D9D4]'
                  } shadow-sm`
                : darkMode
                  ? 'hover:bg-[#2E3944] text-[#748D92]'
                  : 'hover:bg-[#748D92]/20 text-[#748D92]'
            }`}
            title={collapsed ? room.name : undefined}
          >
            <div className={currentRoomId === room.id ? 'text-[#D3D9D4]' : ''}>
              {getRoomIcon(room.icon)}
            </div>
            {!collapsed && (
              <span className="ml-2">{room.name}</span>
            )}
          </button>
        ))}
        
        {rooms.length === 0 && !isAddingRoom && !collapsed && (
          <div className={`text-sm p-4 text-center border rounded-2xl ${
            darkMode 
              ? 'text-[#748D92] border-[#2E3944] bg-[#212A31]' 
              : 'text-[#748D92] border-[#748D92]/30 bg-[#D3D9D4]'
          }`}>
            <p className="font-light">No rooms available.</p>
            <p className="font-light">Create one to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
} 