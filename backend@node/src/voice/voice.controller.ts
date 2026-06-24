import { Request, Response, NextFunction } from 'express';
import { VoiceService } from './voice.service';

export class VoiceController {
  static async query(req: Request, res: Response, next: NextFunction) {
    try {
      const { text, userId } = req.body;
      if (!text) return res.status(400).json({ message: 'text is required' });

      const result = await VoiceService.handleQuery(userId || 'anonymous', text);
      return res.json({ intent: result.intent, reply: result.reply });
    } catch (error) {
      next(error);
    }
  }
}
