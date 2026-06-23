import { CropRepository } from './crop.repository';
import { NodeAiService } from '../ai/ai.service';

export const CropService = {
	async createListing({ farmerId, cropName, quantity, images, location, expectedPrice }: any) {
		// call python AI for analysis and market price
		const aiResult = await NodeAiService.analyzeCrop(cropName, images, location);

		const doc = await CropRepository.create({
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
