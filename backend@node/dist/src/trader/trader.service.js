"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraderService = void 0;
class TraderService {
    static buildRegistrationPayload(payload) {
        const { name, email, phone, password, panNumber, licenseNumber, documents } = payload;
        if (!name || !email || !phone || !password || !panNumber || !licenseNumber) {
            throw { statusCode: 400, message: 'Missing required trader registration fields' };
        }
        if (!documents || (Array.isArray(documents) && documents.length === 0)) {
            throw { statusCode: 400, message: 'Trader registration requires at least one document URL' };
        }
        return {
            role: 'TRADER',
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            phone: String(phone).trim(),
            password: String(password),
            panNumber: String(panNumber).trim(),
            licenseNumber: String(licenseNumber).trim(),
            documents: Array.isArray(documents) ? documents : [String(documents)],
        };
    }
}
exports.TraderService = TraderService;
