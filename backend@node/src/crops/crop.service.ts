import { CropRepository } from './crop.repository';
import { NodeAiService } from '../ai/ai.service';
import { MarketService } from '../market/market.service';

export const CropService = {
	async createListing({ farmerId, cropName, quantity, images, location, expectedPrice }: any) {
		let aiResult: any = {};
		try {
			aiResult = await NodeAiService.analyzeCrop(cropName, images, location);
		} catch {
			aiResult = { qualityGrade: 'N/A', qualityScore: 0, issues: ['AI analysis unavailable'], buyerNote: '' };
		}

		let marketPrice: any = {};
		try {
			const prices = await MarketService.getPrices(cropName);
			marketPrice = {
				minimum: prices.minimum,
				maximum: prices.maximum,
				recommended: prices.recommended,
			};
		} catch {
			marketPrice = { minimum: 0, maximum: 0, recommended: 0 };
		}

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
			marketPrice,
			status: 'ACTIVE',
		});

		return doc;
	},
};
