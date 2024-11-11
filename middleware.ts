import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


const PROTECTED_ROUTES = [
    '/profile/edit',
    '/settings',
    '/courses/creator',
]

export async function middleware(request: NextRequest) {
    const refreshToken = request.cookies.get('refresh_token')

    const hasAuthToken = !!refreshToken?.value

    if (!hasAuthToken && PROTECTED_ROUTES.includes(request?.nextUrl?.pathname)) {
        const absoluteUrl = new URL("/", request.nextUrl.origin);
        return NextResponse.redirect(absoluteUrl.toString());
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}
