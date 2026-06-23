export class IntentService {
  static detectIntentSimple(text: string) {
    const t = (text || '').toLowerCase();

    // simple keyword-based matching for Hindi phrases
    if (/\b(बेचना|बेच|बेचना है|बेचो)\b/.test(t) || /गेंह?w?|गेहूं|फसल/.test(t)) {
      return 'CREATE_CROP_LISTING';
    }

    if (/\b(भाव|रेट|मंडी|दाम|किंमत)\b/.test(t) || /कितना.*(चाल|चल रहा|चल रहा है)/.test(t)) {
      return 'CHECK_MARKET_PRICE';
    }

    if (/\b(मेरी लिस्टिंग|लिस्टिंग|मेरी फसल|दिखाओ|कहाँ पहुंची)\b/.test(t)) {
      return 'VIEW_LISTINGS';
    }

    if (/\b(मदद|क्या करूं|सहायता|कैसे)\b/.test(t)) {
      return 'HELP';
    }

    return 'HELP';
  }
}
