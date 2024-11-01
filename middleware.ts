import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from "@/lib/session/session";

const AUTH_ROUTES = [
    '/auth',
    '/auth/login',
    '/auth/register',
]

const PROTECTED_ROUTES = [
    '/profile/edit',
    '/settings',
    '/courses/creator',
]

export async function middleware(request: NextRequest) {
    const session = await getSession()
    const path = request.nextUrl.pathname

    const isAuthenticated = !!session?.accessToken

    if (isAuthenticated && AUTH_ROUTES.some(route => path.startsWith(route))) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!isAuthenticated && PROTECTED_ROUTES.some(route => path.startsWith(route))) {
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        // Ścieżki auth
        '/auth',
        // Chronione ścieżki
        '/profile/:path*',
        '/settings/:path*',
        '/courses/creator/:path*',
    ]
}