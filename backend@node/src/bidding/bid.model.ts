import mongoose, { Document, Schema } from 'mongoose';

export interface IBid extends Document {
  cropId: string;
  traderId: string;
  price: number;
  quantity: string;
  status: 'ACTIVE' | 'SELECTED' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
}

const BidSchema = new Schema<IBid>({
  cropId: { type: String, required: true },
  traderId: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: String, required: true },
  status: { type: String, default: 'ACTIVE', enum: ['ACTIVE', 'SELECTED', 'ACCEPTED', 'REJECTED'] },
  createdAt: { type: Date, default: () => new Date() },
});

export const BidModel = mongoose.model<IBid>('Bid', BidSchema);
