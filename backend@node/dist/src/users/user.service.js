"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("./user.repository");
class UserService {
    static async findByEmail(email) {
        return user_repository_1.UserRepository.findOne({ email });
    }
    static async findByPhone(phone) {
        return user_repository_1.UserRepository.findOne({ phone });
    }
    static async findAnyDuplicate(payload) {
        const filters = [];
        if (payload.email)
            filters.push({ email: payload.email });
        if (payload.phone)
            filters.push({ phone: payload.phone });
        if (payload.kisanId)
            filters.push({ kisanId: payload.kisanId });
        if (payload.panNumber)
            filters.push({ panNumber: payload.panNumber });
        if (payload.licenseNumber)
            filters.push({ licenseNumber: payload.licenseNumber });
        if (payload.identityNumber)
            filters.push({ identityNumber: payload.identityNumber });
        if (filters.length === 0) {
            return null;
        }
        return user_repository_1.UserRepository.findOne({ $or: filters });
    }
    static async create(payload) {
        return user_repository_1.UserRepository.create(payload);
    }
    static sanitize(user) {
        const object = user.toObject();
        delete object.password;
        return object;
    }
}
exports.UserService = UserService;
