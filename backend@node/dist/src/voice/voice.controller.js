"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceController = void 0;
const voice_service_1 = require("./voice.service");
class VoiceController {
    static async query(req, res, next) {
        try {
            const { text, userId } = req.body;
            if (!text)
                return res.status(400).json({ message: 'text is required' });
            const result = await voice_service_1.VoiceService.handleQuery(userId || 'anonymous', text);
            return res.json({ intent: result.intent, reply: result.reply });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.VoiceController = VoiceController;
