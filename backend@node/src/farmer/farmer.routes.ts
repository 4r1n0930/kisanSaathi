import { Router } from 'express';
import { FarmerController } from './farmer.controller';
import { authMiddleware } from '../common/middleware/auth.middleware';

const router = Router();
router.get('/me', authMiddleware, FarmerController.getProfile);

export default router;
