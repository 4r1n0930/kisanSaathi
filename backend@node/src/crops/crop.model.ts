import mongoose, { Document, Schema } from 'mongoose';

export interface ICropListing extends Document {
  farmerId: string;
  cropName: string;
  quantity: string;
  images: string[];
  aiAnalysis: {
    qualityGrade?: string;
    qualityScore?: number;
    issues?: string[];
  };
  marketPrice?: {
    minimum?: number;
    maximum?: number;
    recommended?: number;
  };
  expectedPrice?: number;
  location?: string;
  status: 'ACTIVE' | 'SOLD' | 'EXPIRED';
  createdAt: Date;
}

const CropListingSchema = new Schema<ICropListing>({
  farmerId: { type: String, required: true },
  cropName: { type: String, required: true },
  quantity: { type: String, required: true },
  images: { type: [String], default: [] },
  aiAnalysis: { type: Object, default: {} },
  marketPrice: { type: Object, default: {} },
  expectedPrice: { type: Number },
  location: { type: String },
  status: { type: String, default: 'ACTIVE' },
  createdAt: { type: Date, default: () => new Date() },
});

export const CropListingModel = mongoose.model<ICropListing>('CropListing', CropListingSchema);
