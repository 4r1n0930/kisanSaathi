import axios from 'axios';
import { IntentService } from './intent.service';

export class AiService {
  static async detectIntent(text: string) {
    const GENAI_ENDPOINT = process.env.GENAI_API_URL;
    const GENAI_KEY = process.env.GENAI_API_KEY;

    if (GENAI_ENDPOINT && GENAI_KEY) {
      console.log('[AiService] Calling Gemini API at', GENAI_ENDPOINT);
      try {
        const prompt = `You are a Hindi agricultural assistant. Input: "${text}". Available intents: CREATE_CROP_LISTING, CHECK_MARKET_PRICE, VIEW_LISTINGS, HELP. Return only valid JSON: {"intent":"<intent>", "parameters":{}}. No other text.`;
        const url = `${GENAI_ENDPOINT}?key=${GENAI_KEY}`;
        const resp = await axios.post(
          url,
          { contents: [{ parts: [{ text: prompt }] }] },
          { headers: { 'Content-Type': 'application/json' } }
        );
        const data = resp.data;
        const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        try {
          const parsed = JSON.parse(raw);
          return parsed.intent || IntentService.detectIntentSimple(text);
        } catch (e) {
          return IntentService.detectIntentSimple(text);
        }
      } catch (e) {
        console.error('[AiService] Gemini API call failed:', e?.response?.data || e?.message || e);
        return IntentService.detectIntentSimple(text);
      }
    }

    console.log('[AiService] No GENAI_API_URL or GENAI_API_KEY set — using keyword matching');
    return IntentService.detectIntentSimple(text);
  }

  static createReplyForIntent(intent: string, text: string) {
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
