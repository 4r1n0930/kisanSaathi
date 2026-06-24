"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectorService = void 0;
class InspectorService {
    static buildRegistrationPayload(payload) {
        const { name, email, phone, password, identityType, identityNumber, documents } = payload;
        if (!name || !email || !phone || !password || !identityType || !identityNumber) {
            throw { statusCode: 400, message: 'Missing required inspector registration fields' };
        }
        if (!documents || (Array.isArray(documents) && documents.length === 0)) {
            throw { statusCode: 400, message: 'Inspector registration requires at least one document URL' };
        }
        return {
            role: 'INSPECTOR',
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            phone: String(phone).trim(),
            password: String(password),
            identityType: String(identityType).trim(),
            identityNumber: String(identityNumber).trim(),
            documents: Array.isArray(documents) ? documents : [String(documents)],
        };
    }
}
exports.InspectorService = InspectorService;
