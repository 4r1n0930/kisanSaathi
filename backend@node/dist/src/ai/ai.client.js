"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeCropWithPython = analyzeCropWithPython;
const axios_1 = __importDefault(require("axios"));
const PY_AI = process.env.PYTHON_AI_URL || '';
async function analyzeCropWithPython(crop, images, location) {
    if (!PY_AI)
        throw new Error('PYTHON_AI_URL not configured');
    const url = `${PY_AI.replace(/\/$/, '')}/analyze-crop`;
    const resp = await axios_1.default.post(url, { crop, images, location }, { timeout: 60000 });
    return resp.data;
}
