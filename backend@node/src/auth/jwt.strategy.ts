import jwt, { SignOptions } from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.config';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export function signJwtToken(payload: JwtPayload): string {
  return jwt.sign(payload, jwtConfig.secret as string, {
    expiresIn: jwtConfig.expiresIn,
  } as any);
}

export function verifyJwtToken(token: string): JwtPayload {
  return jwt.verify(token, jwtConfig.secret) as JwtPayload;
}
