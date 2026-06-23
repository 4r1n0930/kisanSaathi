import { VoiceHistoryModel } from './voice.model';
import { AiService } from './ai.service';

export class VoiceService {
  static async handleQuery(userId: string | number, text: string) {
    const intent = await AiService.detectIntent(text);
    const reply = AiService.createReplyForIntent(intent, text);

    // save history
    await VoiceHistoryModel.create({
      userId,
      inputText: text,
      detectedIntent: intent,
      responseText: reply,
    });

    // Return intent and reply (text). TTS can be handled on client-side.
    return { intent, reply };
  }
}
