import { Response } from 'express';
import { AuthRequest } from '../common/middleware/auth.middleware';

export class FarmerController {
  static async getProfile(req: AuthRequest, res: Response) {
    if (req.user?.role !== 'FARMER') {
      return res.status(403).json({ message: 'Access denied for this role' });
    }

    return res.json({ user: req.user });
  }
}
