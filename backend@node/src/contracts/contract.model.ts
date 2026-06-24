import mongoose, { Document, Schema } from 'mongoose';

export interface IContract extends Document {
  cropId: string;
  bidId: string;
  farmerId: string;
  traderId: string;
  pricePerUnit: number;
  quantity: string;
  totalAmount: number;
  status: 'PENDING_TRADER' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema = new Schema<IContract>({
  cropId: { type: String, required: true },
  bidId: { type: String, required: true },
  farmerId: { type: String, required: true },
  traderId: { type: String, required: true },
  pricePerUnit: { type: Number, required: true },
  quantity: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    default: 'PENDING_TRADER',
    enum: ['PENDING_TRADER', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
  },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

export const ContractModel = mongoose.model<IContract>('Contract', ContractSchema);
