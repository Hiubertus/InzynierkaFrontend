// import {NextResponse} from 'next/server'
// import type {NextRequest} from 'next/server'
//
// export type UserRole = 'USER' | 'VERIFIED' | 'TEACHER' | 'ADMIN';
//
// export const pathAccessConfig: Record<string, {
//     roles?: UserRole[];
//     requireAuth: boolean;
//     redirectIfAuthenticated: boolean;
// }> = {
//     '/': {
//         requireAuth: false,
//         redirectIfAuthenticated: false
//     },
//     '/login': {
//         requireAuth: false,
//         redirectIfAuthenticated: true
//     },
//     '/register': {
//         requireAuth: false,
//         redirectIfAuthenticated: true
//     },
//     '/profile': {
//         requireAuth: true,
//         redirectIfAuthenticated: false
//     }
// }
//
// export function middleware(request: NextRequest) {
//     const {pathname} = request.nextUrl
//
//     const accessToken = request.cookies.get('accessToken')?.value
//     const refreshToken = request.cookies.get('refreshToken')?.value
//
//     const pathConfig = pathAccessConfig[pathname] || {requireAuth: true}
//
//     const isAuthenticated = accessToken && refreshToken
//
//     if (isAuthenticated && pathConfig.redirectIfAuthenticated) {
//         return NextResponse.redirect(new URL('/', request.url))
//     }
//
//     if (!pathConfig.requireAuth) {
//         return NextResponse.next()
//     }
//
//     if (!isAuthenticated) {
//         return NextResponse.redirect(new URL('/login', request.url))
//     }
//
//     if (pathConfig.roles) {
//         try {
//             const payload = JSON.parse(atob(accessToken.split('.')[1]))
//             const userRole = payload.role as UserRole
//
//             if (!pathConfig.roles.includes(userRole)) {
//                 return NextResponse.redirect(new URL('/dashboard', request.url))
//             }
//         } catch {
//             return NextResponse.redirect(new URL('/login', request.url))
//         }
//     }
//
//     return NextResponse.next()
// }
//
// export const config = {
//     matcher: [
//         '/((?!api|_next/static|_next/image|favicon.ico).*)',
//     ],
// }
