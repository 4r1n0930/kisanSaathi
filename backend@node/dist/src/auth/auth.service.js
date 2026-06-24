"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_strategy_1 = require("./jwt.strategy");
const user_service_1 = require("../users/user.service");
const farmer_service_1 = require("../farmer/farmer.service");
const trader_service_1 = require("../trader/trader.service");
const inspector_service_1 = require("../inspector/inspector.service");
const VALID_ROLES = ['FARMER', 'TRADER', 'INSPECTOR'];
class AuthService {
    static async register(payload) {
        const role = String(payload?.role || '').toUpperCase();
        if (!VALID_ROLES.includes(role)) {
            throw { statusCode: 400, message: 'Invalid or missing role for registration' };
        }
        let userPayload;
        if (role === 'FARMER') {
            userPayload = farmer_service_1.FarmerService.buildRegistrationPayload(payload);
        }
        else if (role === 'TRADER') {
            userPayload = trader_service_1.TraderService.buildRegistrationPayload(payload);
        }
        else {
            userPayload = inspector_service_1.InspectorService.buildRegistrationPayload(payload);
        }
        await AuthService.validateDuplicateUser(userPayload);
        const hashedPassword = await bcrypt_1.default.hash(userPayload.password, 10);
        const user = await user_service_1.UserService.create({ ...userPayload, password: hashedPassword });
        const token = (0, jwt_strategy_1.signJwtToken)({ id: user._id.toString(), email: user.email, role: user.role });
        return {
            token,
            user: user_service_1.UserService.sanitize(user),
            role: user.role,
        };
    }
    static async login(email, password) {
        if (!email || !password) {
            throw { statusCode: 400, message: 'Email and password are required' };
        }
        const existingUser = await user_service_1.UserService.findByEmail(email);
        if (!existingUser) {
            throw { statusCode: 401, message: 'Invalid email or password' };
        }
        const passwordMatched = await bcrypt_1.default.compare(password, existingUser.password);
        if (!passwordMatched) {
            throw { statusCode: 401, message: 'Invalid email or password' };
        }
        const token = (0, jwt_strategy_1.signJwtToken)({ id: existingUser._id.toString(), email: existingUser.email, role: existingUser.role });
        return {
            token,
            user: user_service_1.UserService.sanitize(existingUser),
            role: existingUser.role,
        };
    }
    static async validateDuplicateUser(payload) {
        const duplicate = await user_service_1.UserService.findAnyDuplicate({
            email: payload.email,
            phone: payload.phone,
            kisanId: payload.kisanId,
            panNumber: payload.panNumber,
            licenseNumber: payload.licenseNumber,
            identityNumber: payload.identityNumber,
        });
        if (duplicate) {
            throw { statusCode: 409, message: 'Duplicate email, phone or identity document detected' };
        }
    }
}
exports.AuthService = AuthService;
