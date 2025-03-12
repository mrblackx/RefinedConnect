import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketProps {
  url?: string;
  path?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  roomId: string;
  timestamp: string;
}

export interface TypingStatus {
  userId: string;
  typing: boolean;
}

// Check if we're running on the client
const isClient = typeof window !== 'undefined';

export function useSocket({ url = '', path = '/api/socketio' }: UseSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const socketRef = useRef<Socket | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);

  // Initialize socket connection - only on client side
  useEffect(() => {
    // Skip on server-side
    if (!isClient) return;
    
    // Create a new socket connection
    // For development, use the socket server port
    const serverUrl = process.env.NODE_ENV === 'production' 
      ? url 
      : `${window.location.protocol}//${window.location.hostname}:3001`;
    
    const socketIo = io(serverUrl, {
      path,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    // Set up event listeners
    socketIo.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketIo.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });
    
    socketIo.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      // Attempt to reconnect
      setTimeout(() => {
        socketIo.connect();
      }, 1000);
    });

    socketIo.on('message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socketIo.on('typing', (data: TypingStatus) => {
      setTypingUsers((prev) => ({
        ...prev,
        [data.userId]: data.typing,
      }));
    });

    // Store socket reference
    socketRef.current = socketIo;

    // Cleanup function
    return () => {
      socketIo.disconnect();
      socketRef.current = null;
    };
  }, [url, path]);

  // Join a chat room
  const joinRoom = useCallback((roomId: string) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('join_room', roomId);
      setCurrentRoom(roomId);
      // Clear messages when changing rooms
      setMessages([]);
    }
  }, []);

  // Send a message to the current room
  const sendMessage = useCallback((message: Omit<ChatMessage, 'timestamp'>) => {
    if (socketRef.current && currentRoom) {
      socketRef.current.emit('message', {
        ...message,
        roomId: currentRoom,
      });
    }
  }, [currentRoom]);

  // Send typing status
  const sendTypingStatus = useCallback((userId: string, typing: boolean) => {
    if (socketRef.current && currentRoom) {
      socketRef.current.emit('typing', {
        userId,
        typing,
        roomId: currentRoom,
      });
    }
  }, [currentRoom]);

  return {
    isConnected,
    messages,
    typingUsers,
    joinRoom,
    sendMessage,
    sendTypingStatus,
    currentRoom,
  };
} 