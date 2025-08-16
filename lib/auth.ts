import { NextRequest } from 'next/server';

export function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get('Session');
  return !!token;
} 