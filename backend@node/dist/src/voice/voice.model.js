"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceHistoryModel = void 0;
const mongoose_1 = require("mongoose");
const voiceHistorySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.Mixed, required: true },
    inputText: { type: String, required: true },
    detectedIntent: { type: String, required: true },
    responseText: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
}, { versionKey: false });
exports.VoiceHistoryModel = (0, mongoose_1.model)('VoiceHistory', voiceHistorySchema);
