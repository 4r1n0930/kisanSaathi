"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CropService = void 0;
const crop_repository_1 = require("./crop.repository");
const ai_service_1 = require("../ai/ai.service");
exports.CropService = {
    async createListing({ farmerId, cropName, quantity, images, location, expectedPrice }) {
        // call python AI for analysis and market price
        const aiResult = await ai_service_1.NodeAiService.analyzeCrop(cropName, images, location);
        const doc = await crop_repository_1.CropRepository.create({
            farmerId,
            cropName,
            quantity,
            images,
            location,
            expectedPrice,
            aiAnalysis: {
                qualityGrade: aiResult.qualityGrade,
                qualityScore: aiResult.qualityScore,
                issues: aiResult.issues,
            },
            marketPrice: aiResult.marketPrice,
            status: 'ACTIVE',
        });
        return doc;
    },
};
