import mongoose, { Document, Schema } from 'mongoose';

export interface IInspectionReport extends Document {
  inspectorId: string;
  vehiclePhoto: string;
  cropPhoto: string;
  paymentScreenshot: string;
  aiAnalysis: {
    qualityGrade: string;
    qualityScore: number;
    issues: string[];
  };
  status: 'PENDING' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}

const InspectionReportSchema = new Schema<IInspectionReport>({
  inspectorId: { type: String, required: true },
  vehiclePhoto: { type: String, required: true },
  cropPhoto: { type: String, required: true },
  paymentScreenshot: { type: String, required: true },
  aiAnalysis: {
    qualityGrade: { type: String, default: '' },
    qualityScore: { type: Number, default: 0 },
    issues: [{ type: String }],
  },
  status: {
    type: String,
    default: 'COMPLETED',
    enum: ['PENDING', 'COMPLETED'],
  },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

export const InspectionReportModel = mongoose.model<IInspectionReport>('InspectionReport', InspectionReportSchema);
