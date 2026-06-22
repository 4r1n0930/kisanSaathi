import { Router } from 'express';
import { TraderController } from './trader.controller';
import { authMiddleware } from '../common/middleware/auth.middleware';

const router = Router();
router.get('/me', authMiddleware, TraderController.getProfile);

export default router;
