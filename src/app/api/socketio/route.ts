import { NextResponse } from 'next/server';

// This route is a fallback for Socket.IO path
// Socket.IO client will hit this endpoint for long-polling
export async function GET(req: Request) {
  // Redirect to the main socket handler
  return NextResponse.json(
    { success: true, message: 'Socket.IO endpoint' },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  // Handle POST requests for Socket.IO
  return NextResponse.json(
    { success: true, message: 'Socket.IO endpoint' },
    { status: 200 }
  );
}

// Handle OPTIONS preflight requests
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
} 