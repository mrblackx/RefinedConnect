'use client';

import { useState, useEffect } from 'react';
import RoomSelector from '@/components/RoomSelector';
import UserProfile from '@/components/UserProfile';
import ChatRoom from '@/components/ChatRoom';
import { useSocket, ChatMessage } from '@/lib/hooks/useSocket';
import { generateId } from '@/lib/utils';
import { Sun, Moon, Menu, X, MessageCircle, User, Settings, LogOut } from 'lucide-react';

// Default rooms
const DEFAULT_ROOMS = [
  { id: 'general', name: 'General', icon: 'MessageSquare' },
  { id: 'random', name: 'Random', icon: 'Sparkles' },
  { id: 'support', name: 'Support', icon: 'LifeBuoy' },
  { id: 'design', name: 'Design Team', icon: 'Palette' },
  { id: 'development', name: 'Development', icon: 'Code' },
  { id: 'marketing', name: 'Marketing', icon: 'Globe' },
  { id: 'sales', name: 'Sales', icon: 'Users' },
  { id: 'customer-service', name: 'Customer Service', icon: 'Headphones' },
];

// Dummy users
const DUMMY_USERS = [
  { id: 'user1', name: 'Alex Johnson' },
  { id: 'user2', name: 'Sofia Garcia' },
  { id: 'user3', name: 'Michael Chen' },
  { id: 'user4', name: 'Emma Wilson' },
  { id: 'user5', name: 'David Kim' },
];

// Generate dummy messages for rooms
const generateDummyMessages = () => {
  const dummyMessages: Record<string, ChatMessage[]> = {};
  
  // General room messages
  dummyMessages['general'] = [
    {
      id: generateId(),
      userId: 'user1',
      username: 'Alex Johnson',
      message: 'Hey everyone! Welcome to the General chat room.',
      roomId: 'general',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    },
    {
      id: generateId(),
      userId: 'user2',
      username: 'Sofia Garcia',
      message: 'Thanks Alex! Excited to be here. How is everyone doing today?',
      roomId: 'general',
      timestamp: new Date(Date.now() - 3600000 * 23.5).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user3',
      username: 'Michael Chen',
      message: 'Doing great! Just finished a big project yesterday.',
      roomId: 'general',
      timestamp: new Date(Date.now() - 3600000 * 23).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user2',
      username: 'Sofia Garcia',
      message: 'Congrats Michael! What kind of project was it?',
      roomId: 'general',
      timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user3',
      username: 'Michael Chen',
      message: 'A web app using WebSockets actually, similar to this one but for a healthcare client.',
      roomId: 'general',
      timestamp: new Date(Date.now() - 3600000 * 21).toISOString(),
    },
  ];
  
  // Random room messages
  dummyMessages['random'] = [
    {
      id: generateId(),
      userId: 'user4',
      username: 'Emma Wilson',
      message: 'Did anyone see that new sci-fi movie that came out last weekend?',
      roomId: 'random',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user1',
      username: 'Alex Johnson',
      message: 'Yeah! The special effects were amazing. Really enjoyed it.',
      roomId: 'random',
      timestamp: new Date(Date.now() - 3600000 * 11.8).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user5',
      username: 'David Kim',
      message: 'I missed it, but I heard the soundtrack was fantastic!',
      roomId: 'random',
      timestamp: new Date(Date.now() - 3600000 * 11.5).toISOString(),
    },
  ];
  
  // Support room messages
  dummyMessages['support'] = [
    {
      id: generateId(),
      userId: 'user2',
      username: 'Sofia Garcia',
      message: 'Hi support team, I\'m having trouble connecting to the database. Any suggestions?',
      roomId: 'support',
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user5',
      username: 'David Kim',
      message: 'Have you checked if your connection string is correct? That\'s usually the issue.',
      roomId: 'support',
      timestamp: new Date(Date.now() - 3600000 * 7.8).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user2',
      username: 'Sofia Garcia',
      message: 'You\'re right! That was the problem. Thank you!',
      roomId: 'support',
      timestamp: new Date(Date.now() - 3600000 * 7.6).toISOString(),
    },
  ];
  
  // Design team room messages
  dummyMessages['design'] = [
    {
      id: generateId(),
      userId: 'user4',
      username: 'Emma Wilson',
      message: 'Hey design team! I just uploaded the new mockups for the landing page.',
      roomId: 'design',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user2',
      username: 'Sofia Garcia',
      message: 'They look fantastic Emma! I especially love the color palette you chose.',
      roomId: 'design',
      timestamp: new Date(Date.now() - 3600000 * 11.5).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user5',
      username: 'David Kim',
      message: 'I agree with Sofia. The gradient backgrounds are subtle but effective.',
      roomId: 'design',
      timestamp: new Date(Date.now() - 3600000 * 11).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user4',
      username: 'Emma Wilson',
      message: 'Thanks everyone! I went with a more modern approach this time. Should we discuss the mobile layouts now or in our meeting tomorrow?',
      roomId: 'design',
      timestamp: new Date(Date.now() - 3600000 * 10).toISOString(),
    },
  ];
  
  // Development room messages
  dummyMessages['development'] = [
    {
      id: generateId(),
      userId: 'user3',
      username: 'Michael Chen',
      message: 'Has anyone successfully set up the WebSocket server on their local environment?',
      roomId: 'development',
      timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user5',
      username: 'David Kim',
      message: 'Yes, I got it working. The key was to make sure you have the right CORS settings.',
      roomId: 'development',
      timestamp: new Date(Date.now() - 3600000 * 5.8).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user1',
      username: 'Alex Johnson',
      message: "I'm still struggling with the reconnection logic. The client disconnects sometimes and doesn't reconnect properly.",
      roomId: 'development',
      timestamp: new Date(Date.now() - 3600000 * 5.5).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user5',
      username: 'David Kim',
      message: "Let me share a code snippet that handles that. It uses exponential backoff for retries. I'll push it to our repo.",
      roomId: 'development',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ];
  
  // Marketing room messages
  dummyMessages['marketing'] = [
    {
      id: generateId(),
      userId: 'user1',
      username: 'Alex Johnson',
      message: 'The new social media campaign is getting a lot of engagement!',
      roomId: 'marketing',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user4',
      username: 'Emma Wilson',
      message: 'That\'s great to hear! What platforms are performing best?',
      roomId: 'marketing',
      timestamp: new Date(Date.now() - 3600000 * 3.8).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user1',
      username: 'Alex Johnson',
      message: 'Instagram is our top performer, followed by Twitter. Facebook is lagging a bit behind.',
      roomId: 'marketing',
      timestamp: new Date(Date.now() - 3600000 * 3.6).toISOString(),
    },
  ];
  
  // Sales room messages
  dummyMessages['sales'] = [
    {
      id: generateId(),
      userId: 'user5',
      username: 'David Kim',
      message: 'Just closed the deal with Acme Corp! They\'re signing a 2-year contract.',
      roomId: 'sales',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user2',
      username: 'Sofia Garcia',
      message: 'Congratulations David! That\'s a huge win for the quarter.',
      roomId: 'sales',
      timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user3',
      username: 'Michael Chen',
      message: 'Impressive work! What was the deciding factor for them?',
      roomId: 'sales',
      timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user5',
      username: 'David Kim',
      message: 'They were really impressed with our new analytics features and the dedicated support we promised.',
      roomId: 'sales',
      timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(),
    },
  ];
  
  // Customer Service room messages
  dummyMessages['customer-service'] = [
    {
      id: generateId(),
      userId: 'user4',
      username: 'Emma Wilson',
      message: 'We\'ve been seeing an increase in tickets about the login page. Is anyone else noticing this?',
      roomId: 'customer-service',
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user3',
      username: 'Michael Chen',
      message: 'Yes, I\'ve handled several. It seems to be related to the latest update.',
      roomId: 'customer-service',
      timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(),
    },
    {
      id: generateId(),
      userId: 'user2',
      username: 'Sofia Garcia',
      message: 'The development team is aware and working on a fix. Should be resolved by tomorrow.',
      roomId: 'customer-service',
      timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    },
  ];
  
  return dummyMessages;
};

// Color palette variables
const ETQColors = {
  // Main colors
  background: 'bg-[#FFFFFF]',
  backgroundDark: 'bg-[#1A1A1A]',
  foreground: 'text-[#1A1A1A]',
  foregroundDark: 'text-[#F5F5F5]',
  foregroundMuted: 'text-[#666666]',
  foregroundMutedDark: 'text-[#999999]',
  
  // UI elements
  border: 'border-[#E5E5E5]',
  borderDark: 'border-[#2A2A2A]',
  accent: 'bg-[#1A1A1A] text-[#F5F5F5]',
  accentDark: 'bg-[#F5F5F5] text-[#1A1A1A]',
  
  // Hover states
  hoverLight: 'hover:bg-[#F5F5F5]',
  hoverDark: 'hover:bg-[#2A2A2A]',
};

export default function Home() {
  // State for user info
  const [userId] = useState<string>(() => generateId());
  const [username, setUsername] = useState<string>('Albin');
  
  // State for theme
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // State for sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // State for rooms
  const [rooms, setRooms] = useState<Array<{ id: string; name: string; icon?: string }>>(DEFAULT_ROOMS);
  
  // State for usernames
  const [usernames, setUsernames] = useState<Record<string, string>>({});
  
  // State for client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // State for dummy messages
  const [dummyMessages, setDummyMessages] = useState<Record<string, ChatMessage[]>>({});
  
  // State for profile menu
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  
  // Flag for client-side rendering to prevent hydration errors
  useEffect(() => {
    setIsClient(true);
    
    // Initialize dummy usernames and messages
    const initialUsernames: Record<string, string> = {};
    DUMMY_USERS.forEach(user => {
      initialUsernames[user.id] = user.name;
    });
    setUsernames(initialUsernames);
    
    // Generate dummy messages
    setDummyMessages(generateDummyMessages());
  }, []);
  
  // Initialize socket connection - only on client
  const {
    isConnected,
    messages: socketMessages,
    typingUsers,
    joinRoom,
    sendMessage,
    sendTypingStatus,
    currentRoom,
  } = useSocket();
  
  // Combine socket messages with dummy messages
  const messages = currentRoom && dummyMessages[currentRoom] 
    ? [...dummyMessages[currentRoom], ...socketMessages] 
    : socketMessages;
  
  // Effect to store username in localStorage - only run on client
  useEffect(() => {
    if (!isClient) return;
    
    // Try to load username from localStorage
    const storedUsername = localStorage.getItem('chat-username');
    if (storedUsername) {
      setUsername(storedUsername);
      // Add username to usernames map
      setUsernames(prev => ({ ...prev, [userId]: storedUsername }));
    } else {
      // Set default username to "Albin" if not in localStorage
      setUsername('Albin');
      localStorage.setItem('chat-username', 'Albin');
      // Add username to usernames map
      setUsernames(prev => ({ ...prev, [userId]: 'Albin' }));
    }
    
    // Try to load theme preference from localStorage
    const storedTheme = localStorage.getItem('theme-preference');
    if (storedTheme) {
      setDarkMode(storedTheme === 'dark');
    }
    
    // Clear any old room data to avoid issues with saved rooms missing icons
    localStorage.removeItem('chat-rooms');
    
    // Set rooms to default
    setRooms(DEFAULT_ROOMS);
    
    // Generate dummy messages
    setDummyMessages(generateDummyMessages());
  }, [userId, isClient]);
  
  // Effect to update localStorage when theme changes
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('theme-preference', darkMode ? 'dark' : 'light');
  }, [darkMode, isClient]);
  
  // Effect to update localStorage when rooms change - only run on client
  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem('chat-rooms', JSON.stringify(rooms));
  }, [rooms, isClient]);
  
  // Effect to initialize the socket connection - only run on client
  useEffect(() => {
    if (!isClient) return;
    
    // Initialize Socket.IO server by making a request to the API endpoint
    const initSocketServer = async () => {
      try {
        const response = await fetch('/api/socket');
        const data = await response.json();
        console.log('Socket.IO server status:', data);
      } catch (error) {
        console.error('Error initializing Socket.IO server:', error);
      }
    };
    
    initSocketServer();
  }, [isClient]);
  
  // Handle room selection
  const handleSelectRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      joinRoom(roomId);
    }
  };
  
  // Handle adding a new room
  const handleAddRoom = (room: { id: string; name: string }) => {
    setRooms(prev => [...prev, room]);
  };
  
  // Handle username update
  const handleUpdateUsername = (newUsername: string) => {
    setUsername(newUsername);
    if (isClient) {
      localStorage.setItem('chat-username', newUsername);
    }
    // Update usernames map
    setUsernames(prev => ({ ...prev, [userId]: newUsername }));
  };
  
  // Handle sending a message
  const handleSendMessage = (message: string) => {
    if (!currentRoom || !username) return;
    
    const newMessage: Omit<ChatMessage, 'timestamp'> = {
      id: generateId(),
      userId,
      username: username || 'Anonymous',
      message,
      roomId: currentRoom,
    };
    
    sendMessage(newMessage);
    
    // Add message to dummy messages for persistence during the session
    setDummyMessages(prev => {
      // Create a new messages array for the room if it doesn't exist
      const roomMessages = prev[currentRoom] || [];
      return {
        ...prev,
        [currentRoom]: [
          ...roomMessages, 
          { ...newMessage, timestamp: new Date().toISOString() }
        ]
      };
    });
  };
  
  // Handle typing status
  const handleTyping = (isTyping: boolean) => {
    sendTypingStatus(userId, isTyping);
  };
  
  // Get the name of the current room
  const currentRoomName = currentRoom 
    ? rooms.find(r => r.id === currentRoom)?.name || currentRoom
    : null;
  
  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // If rendering on server or during first client render, show a simple loading state
  if (!isClient) {
    return (
      <main className="flex h-screen items-center justify-center bg-[#FFFFFF] dark:bg-[#1A1A1A]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 border-4 border-[#E5E5E5] border-t-[#1A1A1A] rounded-none animate-spin"></div>
          <p className="text-xl text-[#1A1A1A] dark:text-[#F5F5F5] font-serif">Loading RefinedConnect...</p>
        </div>
      </main>
    );
  }
  
  return (
    <main 
      className={`flex h-screen font-light ${
        darkMode 
          ? 'bg-[#1A1A1A] [background-image:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px]' 
          : 'bg-white [background-image:linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] [background-size:32px_32px]'
      }`}
    >
      {/* Dark mode toggle and profile menu - Fixed to top right */}
      <div className="fixed top-2 right-4 z-50 flex items-center gap-2">
        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className={`p-2.5 rounded-2xl transition-all duration-200 hover:scale-105 shadow-sm ${
              darkMode 
                ? 'bg-[#2A2A2A] text-[#999999] hover:bg-[#333333]' 
                : 'bg-[#F5F5F5] text-[#666666] hover:bg-[#E5E5E5]'
            }`}
          >
            <User className="w-5 h-5" />
          </button>
          
          {/* Dropdown Menu */}
          {profileMenuOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-lg ${
              darkMode 
                ? 'bg-[#2A2A2A] border border-[#333333]' 
                : 'bg-white border border-[#E5E5E5]'
            }`}>
              <div className="py-1">
                <button
                  className={`flex items-center w-full px-4 py-3 text-sm ${
                    darkMode 
                      ? 'text-[#F5F5F5] hover:bg-[#333333]' 
                      : 'text-[#1A1A1A] hover:bg-[#F5F5F5]'
                  } transition-colors duration-200`}
                >
                  <User className="w-4 h-4 mr-3" />
                  My Profile
                </button>
                <button
                  className={`flex items-center w-full px-4 py-3 text-sm ${
                    darkMode 
                      ? 'text-[#F5F5F5] hover:bg-[#333333]' 
                      : 'text-[#1A1A1A] hover:bg-[#F5F5F5]'
                  } transition-colors duration-200`}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </button>
                <button
                  className={`flex items-center w-full px-4 py-3 text-sm ${
                    darkMode 
                      ? 'text-[#F5F5F5] hover:bg-[#333333]' 
                      : 'text-[#1A1A1A] hover:bg-[#F5F5F5]'
                  } transition-colors duration-200`}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <div className={`relative inline-flex h-10 w-20 items-center rounded-2xl transition-colors duration-300 focus:outline-none shadow-sm ${darkMode ? 'bg-[#2A2A2A]' : 'bg-[#F5F5F5]'}`}>
          <span className="sr-only">Toggle dark mode</span>
          <span className={`absolute left-1 flex h-8 w-8 items-center justify-center rounded-xl ${
            darkMode 
              ? 'translate-x-10 bg-[#1A1A1A] text-[#F5F5F5] shadow-sm' 
              : 'translate-x-0 bg-white text-[#1A1A1A] shadow-sm'
            } transform transition-all duration-300 hover:scale-105`}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </span>
          <span className={`absolute right-1 flex h-8 w-8 items-center justify-center rounded-xl ${
            !darkMode 
              ? 'translate-x-0 bg-[#F5F5F5] text-[#666666]' 
              : '-translate-x-10 bg-[#2A2A2A] text-[#999999]'
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

      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-24' : 'w-80'} border-r ${
        darkMode 
          ? 'border-[#2A2A2A] bg-[#1A1A1A]' 
          : 'border-[#E5E5E5] bg-white'
        } flex flex-col transition-all duration-300`}>
        {/* App title and sidebar toggle */}
        <div className={`p-4 border-b ${
          darkMode 
            ? 'border-[#2A2A2A] bg-[#1A1A1A]' 
            : 'border-[#E5E5E5] bg-white'
          } flex justify-between items-center`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'w-full justify-center' : ''}`}>
            {sidebarCollapsed ? (
              <div className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-transform hover:scale-105 ${
                darkMode 
                  ? 'bg-[#F5F5F5] text-[#1A1A1A]' 
                  : 'bg-[#1A1A1A] text-[#F5F5F5]'
                } shadow-sm`}>
                <MessageCircle className="w-6 h-6" />
              </div>
            ) : (
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 mr-4 rounded-2xl transition-transform hover:scale-105 ${
                  darkMode 
                    ? 'bg-[#F5F5F5] text-[#1A1A1A]' 
                    : 'bg-[#1A1A1A] text-[#F5F5F5]'
                  } shadow-sm`}>
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h1 className={`text-xl font-serif tracking-tight ${darkMode ? 'text-[#F5F5F5]' : 'text-[#1A1A1A]'}`}>
                  RefinedConnect
                </h1>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className={`p-3 rounded-2xl ${
                darkMode 
                  ? 'bg-[#2A2A2A] text-[#999999] hover:bg-[#333333]' 
                  : 'bg-[#F5F5F5] text-[#666666] hover:bg-[#E5E5E5]'
                } focus:outline-none transition-all duration-200 hover:scale-105 shadow-sm`}
              aria-label="Collapse sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
        
        {/* Hamburger button in collapsed state */}
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className={`p-3 mx-auto mt-1 rounded-2xl ${
              darkMode 
                ? 'bg-[#2A2A2A] text-[#999999] hover:bg-[#333333]' 
                : 'bg-[#F5F5F5] text-[#666666] hover:bg-[#E5E5E5]'
              } focus:outline-none transition-all duration-200 hover:scale-105 shadow-sm`}
            aria-label="Expand sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* User profile section */}
        <UserProfile
          userId={userId}
          username={username}
          onUpdateUsername={handleUpdateUsername}
          darkMode={darkMode}
          collapsed={sidebarCollapsed}
        />
        
        {/* Room selector */}
        <RoomSelector
          rooms={rooms}
          currentRoomId={currentRoom}
          onSelectRoom={handleSelectRoom}
          onAddRoom={handleAddRoom}
          darkMode={darkMode}
          collapsed={sidebarCollapsed}
        />
        
        {/* Connection status */}
        <div className={`mt-auto p-3 border-t ${
          darkMode 
            ? 'border-[#333333] bg-[#111111]' 
            : 'border-[#e0e0e0] bg-white'
          }`}>
          <div className="flex items-center justify-center text-sm">
            <div 
              className={`w-2 h-2 rounded-full mr-2 ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} 
            />
            {!sidebarCollapsed && (
              <span className={darkMode ? 'text-[#a0a0a0]' : 'text-[#767676]'}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <ChatRoom
          messages={messages}
          typingUsers={typingUsers}
          usernames={usernames}
          currentUserId={userId}
          currentRoom={currentRoomName}
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          darkMode={darkMode}
        />
      </div>
    </main>
  );
}
