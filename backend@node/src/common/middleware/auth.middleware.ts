import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken, JwtPayload } from '../../auth/jwt.strategy';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }

  try {
    const token = authorization.split(' ')[1];
    req.user = verifyJwtToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
