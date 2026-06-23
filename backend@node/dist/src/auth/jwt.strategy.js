"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signJwtToken = signJwtToken;
exports.verifyJwtToken = verifyJwtToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_config_1 = require("../config/jwt.config");
function signJwtToken(payload) {
    return jsonwebtoken_1.default.sign(payload, jwt_config_1.jwtConfig.secret, {
        expiresIn: jwt_config_1.jwtConfig.expiresIn,
    });
}
function verifyJwtToken(token) {
    return jsonwebtoken_1.default.verify(token, jwt_config_1.jwtConfig.secret);
}
