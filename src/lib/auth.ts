import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
  };
}

export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };
    return decoded;
  } catch {
    throw new Error('Invalid token');
  }
}

export function getTokenFromRequest(request: NextRequest): string {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  return authHeader.split(' ')[1];
}

export function authenticateUser(request: NextRequest) {
  const token = getTokenFromRequest(request);
  return verifyJWT(token);
}
