import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  const publicPaths = ['/admin/login']

  if (publicPaths.includes(path)) {
    return NextResponse.next()
  }

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
  matcher: ['/admin/:path*']
}