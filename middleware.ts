import { NextRequest, NextResponse } from 'next/server'

// Paths that require authentication
const protectedPaths = [
  '/api/votes',
  '/api/proposals',
  '/api/users'
]

// Paths that are public
const publicPaths = [
  '/api/proposals', // GET requests are public
  '/api/auth'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for non-API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path)) && request.method === 'GET') {
    return NextResponse.next()
  }

  // Check for authentication on protected paths
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const authHeader = request.headers.get('authorization')
    
    // For POST/PUT/DELETE requests, require authentication
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
    }
  }

  // Add CORS headers
  const response = NextResponse.next()
  
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return response
}

export const config = {
  matcher: [
    '/api/:path*'
  ]
}
