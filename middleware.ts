// export { default } from 'next-auth/middleware';
import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
	function middleware(request: NextRequestWithAuth) {
		if (request.nextUrl.pathname === '/') {
			console.log(request.nextauth);
			if (request.nextauth.token?.role === 'USER') {
				return NextResponse.redirect(new URL('/user', request.nextUrl));
			}
			if (request.nextauth.token?.role === 'CANTEEN') {
				return NextResponse.redirect(
					new URL('/canteen', request.nextUrl)
				);
			}
			if (request.nextauth.token?.role === 'ADMIN') {
				return NextResponse.redirect(
					new URL('/admin', request.nextUrl)
				);
			}
		}
		if (
			request.nextUrl.pathname === '/user' &&
			request.nextauth.token?.role !== 'USER'
		) {
			return NextResponse.redirect(
				new URL('/access-denied', request.nextUrl)
			);
		}
		if (
			request.nextUrl.pathname === '/canteen' &&
			request.nextauth.token?.role !== 'CANTEEN'
		) {
			return NextResponse.redirect(
				new URL('/access-denied', request.nextUrl)
			);
		}
		if (
			request.nextUrl.pathname === '/admin' &&
			request.nextauth.token?.role !== 'ADMIN'
		) {
			return NextResponse.redirect(
				new URL('/access-denied', request.nextUrl)
			);
		}
	},
	{
		callbacks: {
			authorized({ token }) {
				return !!token;
			},
		},
	}
);

export const config = {
	matcher: ['/', '/user', '/canteen', '/admin'],
};
