import { InspectionReportModel, IInspectionReport } from './inspection.model';
import { analyzeCropWithPython } from '../ai/ai.client';

export const InspectionService = {
  async analyzeCropImage(imageUrl: string) {
    try {
      const result = await analyzeCropWithPython('grain', [imageUrl]);
      return {
        qualityGrade: result.qualityGrade || '',
        qualityScore: result.qualityScore || 0,
        issues: result.issues || [],
        buyerNote: result.buyerNote || '',
      };
    } catch {
      return {
        qualityGrade: 'N/A',
        qualityScore: 0,
        issues: ['AI analysis unavailable'],
        buyerNote: 'Analysis service could not be reached',
      };
    }
  },

  async createReport(data: {
    inspectorId: string;
    vehiclePhoto: string;
    cropPhoto: string;
    paymentScreenshot: string;
    aiAnalysis?: { qualityGrade: string; qualityScore: number; issues: string[] };
  }) {
    const report = await InspectionReportModel.create({
      inspectorId: data.inspectorId,
      vehiclePhoto: data.vehiclePhoto,
      cropPhoto: data.cropPhoto,
      paymentScreenshot: data.paymentScreenshot,
      aiAnalysis: data.aiAnalysis || { qualityGrade: '', qualityScore: 0, issues: [] },
      status: 'COMPLETED',
    });

    return report;
  },

  async findById(id: string) {
    return InspectionReportModel.findById(id).lean().exec();
  },

  async findByInspector(inspectorId: string) {
    return InspectionReportModel.find({ inspectorId }).sort({ createdAt: -1 }).lean().exec();
  },

  async findAll() {
    return InspectionReportModel.find().sort({ createdAt: -1 }).lean().exec();
  },
};
