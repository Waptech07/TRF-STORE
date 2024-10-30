import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // List of paths that require authentication
    const protectedPaths = ['/admin/products', '/admin/categories'];
    const isProtectedRoute = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

    if (isProtectedRoute && !token) {
        // Redirect unauthenticated users to the login page
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/products/:path*', '/admin/categories/:path*'], // Paths to apply middleware
};
