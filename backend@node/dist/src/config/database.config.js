"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI?.trim() || '';
if (!MONGO_URI) {
    throw new Error('MONGO_URI is required in environment configuration');
}
mongoose_1.default.set('strictQuery', true);
async function connectDatabase() {
    return mongoose_1.default.connect(MONGO_URI, {
        dbName: 'kisansathi',
    });
}
