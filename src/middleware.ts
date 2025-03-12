import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const { pathname } = request.nextUrl;

  // Only run the middleware for the socket API route and socketio paths
  if (pathname.startsWith('/api/socket') || pathname.startsWith('/api/socketio')) {
    // Add CORS headers to allow cross-origin requests
    const response = NextResponse.next();
    
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }

  // For all other routes, continue with the request
  return NextResponse.next();
}

// Configure the matcher to only run the middleware for specific routes
export const config = {
  matcher: [
    '/api/socket/:path*',
    '/api/socketio/:path*',
  ],
}; 