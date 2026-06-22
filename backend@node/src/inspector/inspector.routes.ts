import { Router } from 'express';
import { InspectorController } from './inspector.controller';
import { authMiddleware } from '../common/middleware/auth.middleware';

const router = Router();
router.get('/me', authMiddleware, InspectorController.getProfile);

export default router;
