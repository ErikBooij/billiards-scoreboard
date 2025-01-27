import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
  const response = NextResponse.next();
  response.headers.set('Permissions-Policy', 'screen-wake-lock=(self)');
  return response;
}

export const config = {
  matcher: '/:path*',
};
