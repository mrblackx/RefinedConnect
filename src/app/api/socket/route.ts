import { NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { NextApiResponse } from 'next';

// Store the Socket.IO server instance in a global variable
// This is necessary because Next.js Edge Runtime doesn't support global variables like 'global.io'
let io: SocketIOServer | null = null;

// This handler sets up the Socket.IO server and registers event handlers
export async function GET(req: Request) {
  if (io) {
    // If the Socket.IO server is already running, return success
    return NextResponse.json({ success: true, message: 'Socket.IO server already running' });
  }
  
  try {
    // For App Router, we need to create a Socket.IO server connected to the server instance
    // This approach uses a server-side singleton to maintain the Socket.IO instance
    const socketIOPromise = createSocketIOServer();
    io = await socketIOPromise;
    
    return NextResponse.json({ success: true, message: 'Socket.IO server started' });
  } catch (error) {
    console.error('Failed to start Socket.IO server:', error);
    return NextResponse.json({ success: false, message: 'Failed to start Socket.IO server' }, { status: 500 });
  }
}

// This function creates a Socket.IO server and sets up event handlers
async function createSocketIOServer() {
  // In App Router, we need to use dynamic import for socket.io-adapter
  // to avoid issues with the Edge runtime
  const { createServer } = await import('http');
  const { Server } = await import('socket.io');
  
  // Create an HTTP server
  const httpServer = createServer();
  
  // Create a Socket.IO server
  const io = new Server(httpServer, {
    path: '/api/socketio',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  
  // Set up event handlers
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // Handle user joining a chat room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });
    
    // Handle chat messages
    socket.on('message', (data) => {
      // Add timestamp if not present
      const messageData = {
        ...data,
        timestamp: data.timestamp || new Date().toISOString()
      };
      
      // Broadcast the message to the specified room
      io.to(data.roomId).emit('message', messageData);
      console.log(`Message sent to room ${data.roomId}: ${data.message}`);
    });
    
    // Handle user typing status
    socket.on('typing', (data) => {
      socket.to(data.roomId).emit('typing', { userId: data.userId, typing: data.typing });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
  
  // Start the HTTP server
  const PORT = parseInt(process.env.SOCKET_PORT || '3001', 10);
  httpServer.listen(PORT, () => {
    console.log(`Socket.IO server started on port ${PORT}`);
  });
  
  return io;
} 