// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  const publicPaths = ['/admin/login', '/']
  
  // Allow access to public paths
  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }

  // Protect admin routes
  if (path.startsWith('/admin')) {
    const token = request.cookies.get('adminToken')?.value

    if (!token) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('redirect', path)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/']
}