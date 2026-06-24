"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_service_1 = require("./cloudinary.service");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post('/', upload.single('document'), async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'Document file is required' });
        }
        const url = await (0, cloudinary_service_1.uploadDocument)(file);
        return res.status(201).json({ url });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
// Upload multiple crop images and return array of URLs
router.post('/upload-crop-images', upload.array('images', 6), async (req, res, next) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }
        const urls = [];
        for (const file of files) {
            const url = await (0, cloudinary_service_1.uploadDocument)(file, 'kisan_crops');
            urls.push(url);
        }
        return res.status(201).json({ images: urls });
    }
    catch (error) {
        next(error);
    }
});
