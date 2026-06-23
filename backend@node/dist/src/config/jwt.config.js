"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET?.trim();
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is required in environment configuration');
}
exports.jwtConfig = {
    secret: JWT_SECRET,
    expiresIn: '7d',
};
