import { Response } from 'express';
import { AuthRequest } from '../common/middleware/auth.middleware';

export class InspectorController {
  static async getProfile(req: AuthRequest, res: Response) {
    if (req.user?.role !== 'INSPECTOR') {
      return res.status(403).json({ message: 'Access denied for this role' });
    }

    return res.json({ user: req.user });
  }
}
