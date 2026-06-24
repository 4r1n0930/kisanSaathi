"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceService = void 0;
const voice_model_1 = require("./voice.model");
const ai_service_1 = require("./ai.service");
class VoiceService {
    static async handleQuery(userId, text) {
        const intent = await ai_service_1.AiService.detectIntent(text);
        const reply = ai_service_1.AiService.createReplyForIntent(intent, text);
        // save history
        await voice_model_1.VoiceHistoryModel.create({
            userId,
            inputText: text,
            detectedIntent: intent,
            responseText: reply,
        });
        // Return intent and reply (text). TTS can be handled on client-side.
        return { intent, reply };
    }
}
exports.VoiceService = VoiceService;
