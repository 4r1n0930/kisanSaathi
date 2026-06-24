import { Router } from 'express';
import { VoiceController } from './voice.controller';

const router = Router();

router.post('/query', VoiceController.query);

export default router;
