// frontend/src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('auth_token')
    const { pathname } = request.nextUrl

    // Protected routes
    const protectedRoutes = ['/dashboard', '/admin', '/trading', '/wallet', '/portfolio']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    // Auth routes (should redirect if already logged in)
    const authRoutes = ['/auth/login', '/auth/open-account']
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !authToken) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Redirect to dashboard if accessing auth routes while logged in
    if (isAuthRoute && authToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/trading/:path*',
        '/wallet/:path*',
        '/portfolio/:path*',
        '/auth/login',
        '/auth/open-account'
    ]
}
