import {  NextResponse } from 'next/server'
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt'
import { checkAdminStatus } from '@/utils/helper';


export async function middleware(request: NextRequest, response: NextResponse) {
  const loginUrl = '/login'
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process?.env?.NEXTAUTH_SECRET,
    cookieName: "next-auth.session-token"
  });
  const admin = token ?  checkAdminStatus(token.role) : false
  const isValid = token ?  Date.now() < token.exp * 1000 : false
  
  if(pathname === loginUrl && token && isValid || pathname === '/' && token && isValid) {
    if(admin) {
      return NextResponse.redirect(new URL('/admin', request.url))
    } else {
      return NextResponse.redirect(new URL('/employee', request.url))
    }
  }

  if(!!pathname.match('admin') && admin) {
    return NextResponse.next()
  }

  if(!!pathname.match('admin') && token && !admin) {
    return NextResponse.redirect(new URL('/employee', request.url))
  }

  if(!!pathname.match('employee') && token && admin) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  
  if(!token && pathname !== loginUrl ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return  NextResponse.next()
}
 
export const config = {
  matcher: [
    '/reports/:path*',
    '/employee/:path*',
    '/admin/:path*',
    '/login',
    '/'
  ]
}

