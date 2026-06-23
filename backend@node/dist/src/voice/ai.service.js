"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const axios_1 = __importDefault(require("axios"));
const intent_service_1 = require("./intent.service");
class AiService {
    // Try to call external GenAI if configured, otherwise use local intent detector
    static async detectIntent(text) {
        const GENAI_ENDPOINT = process.env.GENAI_API_URL;
        const GENAI_KEY = process.env.GENAI_API_KEY;
        if (GENAI_ENDPOINT && GENAI_KEY) {
            try {
                const prompt = `You are a Hindi agricultural assistant. Input: ${text}. Available intents: CREATE_CROP_LISTING, CHECK_MARKET_PRICE, VIEW_LISTINGS, HELP. Return only JSON: {"intent":"", "parameters":{}}`;
                const resp = await axios_1.default.post(GENAI_ENDPOINT, { prompt, max_tokens: 200 }, { headers: { Authorization: `Bearer ${GENAI_KEY}` } });
                const data = resp.data;
                // naive parsing: expect data.choices[0].text or data.output
                const raw = data?.choices?.[0]?.text || data?.output || '';
                try {
                    const parsed = JSON.parse(raw);
                    return parsed.intent || intent_service_1.IntentService.detectIntentSimple(text);
                }
                catch (e) {
                    return intent_service_1.IntentService.detectIntentSimple(text);
                }
            }
            catch (e) {
                return intent_service_1.IntentService.detectIntentSimple(text);
            }
        }
        return intent_service_1.IntentService.detectIntentSimple(text);
    }
    static createReplyForIntent(intent, text) {
        switch (intent) {
            case 'CREATE_CROP_LISTING':
                return 'ठीक है, मैं आपकी फसल की लिस्टिंग शुरू कर देता हूँ। कृपया फसल का नाम, मात्रा और अपेक्षित कीमत बताएं।';
            case 'CHECK_MARKET_PRICE':
                return 'ठीक है, मैं आसपास के मंडी भाव देख रहा हूँ। एक पल रुकिए।';
            case 'VIEW_LISTINGS':
                return 'आपकी लिस्टिंग दिखा रहा हूँ। कृपया कुछ क्षण दें।';
            case 'HELP':
            default:
                return 'मैं आपकी मदद के लिए यहाँ हूँ। आप कह सकते हैं: "मुझे गेहूं बेचना है" या "आज मंडी का रेट बताओ"।';
        }
    }
}
exports.AiService = AiService;
