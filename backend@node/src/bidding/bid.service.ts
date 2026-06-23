import { BidModel } from './bid.model';
import { CropListingModel } from '../crops/crop.model';

export const BidService = {
  async create(payload: { cropId: string; traderId?: string; price: number; quantity: string }) {
    const bid = await BidModel.create({
      cropId: payload.cropId,
      traderId: payload.traderId || 'anonymous-trader',
      price: payload.price,
      quantity: payload.quantity,
      status: 'PENDING',
    });
    return bid;
  },

  async findByTrader(traderId?: string) {
    const filter = traderId ? { traderId } : {};
    const bids = await BidModel.find(filter).sort({ createdAt: -1 }).lean().exec();

    const cropIds = [...new Set(bids.map(b => b.cropId))];
    const crops = await CropListingModel.find({ _id: { $in: cropIds } }).lean().exec();
    const cropMap = new Map(crops.map(c => [c._id.toString(), c]));

    return bids.map(b => ({
      ...b,
      crop: cropMap.get(b.cropId.toString()) || null,
    }));
  },
};
