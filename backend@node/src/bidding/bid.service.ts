import { BidModel } from './bid.model';
import { CropListingModel } from '../crops/crop.model';

export const BidService = {
  async create(payload: { cropId: string; traderId?: string; price: number; quantity: string }) {
    const bid = await BidModel.create({
      cropId: payload.cropId,
      traderId: payload.traderId || 'anonymous-trader',
      price: payload.price,
      quantity: payload.quantity,
      status: 'ACTIVE',
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

  async findByFarmer(farmerId: string) {
    const crops = await CropListingModel.find({ farmerId }).lean().exec();
    const cropIds = crops.map(c => c._id.toString());
    if (cropIds.length === 0) return [];

    const bids = await BidModel.find({ cropId: { $in: cropIds } }).sort({ createdAt: -1 }).lean().exec();

    const cropMap = new Map(crops.map(c => [c._id.toString(), c]));

    return bids.map(b => ({
      ...b,
      crop: cropMap.get(b.cropId.toString()) || null,
    }));
  },

  async findById(bidId: string) {
    return BidModel.findById(bidId).lean().exec();
  },

  async updateStatus(bidId: string, status: string) {
    return BidModel.findByIdAndUpdate(bidId, { status }, { new: true }).lean().exec();
  },

  async rejectAllOtherBids(cropId: string, excludeBidId: string) {
    return BidModel.updateMany(
      { cropId, _id: { $ne: excludeBidId }, status: 'ACTIVE' },
      { status: 'REJECTED' },
    ).exec();
  },
};
