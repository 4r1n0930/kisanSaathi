"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = uploadDocument;
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
async function uploadDocument(file, folder = 'kisan_documents') {
    if (!file || !file.buffer) {
        throw new Error('File upload failed or file buffer is missing');
    }
    return new Promise((resolve, reject) => {
        const stream = cloudinary_config_1.default.uploader.upload_stream({ folder, resource_type: 'image' }, (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result?.secure_url) {
                return reject(new Error('Cloudinary upload did not return a URL'));
            }
            resolve(result.secure_url);
        });
        stream.end(file.buffer);
    });
}
