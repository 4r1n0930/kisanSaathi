import mongoose, { Document, Schema } from 'mongoose';

export interface ICropMetadata extends Document {
  name: string;
  hindiName: string;
  defaultMinPrice: number;
  defaultMaxPrice: number;
  defaultRecommendedPrice: number;
  imageUrl?: string;
  active: boolean;
}

const CropMetadataSchema = new Schema<ICropMetadata>({
  name: { type: String, required: true, unique: true },
  hindiName: { type: String, required: true },
  defaultMinPrice: { type: Number, required: true },
  defaultMaxPrice: { type: Number, required: true },
  defaultRecommendedPrice: { type: Number, required: true },
  imageUrl: { type: String },
  active: { type: Boolean, default: true },
});

export const CropMetadataModel = mongoose.model<ICropMetadata>('CropMetadata', CropMetadataSchema);
