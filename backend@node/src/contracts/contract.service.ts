import { ContractModel } from './contract.model';
import { BidService } from '../bidding/bid.service';
import { CropListingModel } from '../crops/crop.model';
import { UserModel } from '../users/user.model';

export const ContractService = {
  async selectBid(bidId: string, farmerId: string) {
    const bid = await BidService.findById(bidId);
    if (!bid) throw Object.assign(new Error('Bid not found'), { statusCode: 404 });

    const crop = await CropListingModel.findById(bid.cropId).lean().exec();
    if (!crop) throw Object.assign(new Error('Crop not found'), { statusCode: 404 });
    if (crop.farmerId !== farmerId) throw Object.assign(new Error('Unauthorized'), { statusCode: 403 });

    const existingContract = await ContractModel.findOne({ bidId }).lean().exec();
    if (existingContract) throw Object.assign(new Error('Contract already exists for this bid'), { statusCode: 400 });

    await BidService.updateStatus(bidId, 'SELECTED');
    await BidService.rejectAllOtherBids(bid.cropId, bidId);

    const totalAmount = bid.price * Number(bid.quantity);

    const contract = await ContractModel.create({
      cropId: bid.cropId,
      bidId,
      farmerId,
      traderId: bid.traderId,
      pricePerUnit: bid.price,
      quantity: bid.quantity,
      totalAmount,
      status: 'PENDING_TRADER',
    });

    return contract;
  },

  async acceptContract(contractId: string, traderId: string) {
    const contract = await ContractModel.findById(contractId).exec();
    if (!contract) throw Object.assign(new Error('Contract not found'), { statusCode: 404 });
    if (contract.traderId !== traderId) throw Object.assign(new Error('Unauthorized'), { statusCode: 403 });
    if (contract.status !== 'PENDING_TRADER') throw Object.assign(new Error('Contract cannot be accepted in current state'), { statusCode: 400 });

    contract.status = 'ACCEPTED';
    contract.updatedAt = new Date();
    await contract.save();

    await BidService.updateStatus(contract.bidId, 'ACCEPTED');
    await CropListingModel.findByIdAndUpdate(contract.cropId, { status: 'SOLD' }).exec();

    return contract;
  },

  async rejectContract(contractId: string, traderId: string) {
    const contract = await ContractModel.findById(contractId).exec();
    if (!contract) throw Object.assign(new Error('Contract not found'), { statusCode: 404 });
    if (contract.traderId !== traderId) throw Object.assign(new Error('Unauthorized'), { statusCode: 403 });
    if (contract.status !== 'PENDING_TRADER') throw Object.assign(new Error('Contract cannot be rejected in current state'), { statusCode: 400 });

    contract.status = 'REJECTED';
    contract.updatedAt = new Date();
    await contract.save();

    await BidService.updateStatus(contract.bidId, 'REJECTED');

    return contract;
  },

  async findById(contractId: string) {
    const contract = await ContractModel.findById(contractId).lean().exec();
    if (!contract) return null;

    const [crop, farmer, trader] = await Promise.all([
      CropListingModel.findById(contract.cropId).lean().exec(),
      UserModel.findById(contract.farmerId).lean().exec(),
      UserModel.findById(contract.traderId).lean().exec(),
    ]);

    return { ...contract, crop, farmer, trader };
  },

  async findByTrader(traderId: string) {
    const contracts = await ContractModel.find({ traderId }).sort({ createdAt: -1 }).lean().exec();
    const cropIds = [...new Set(contracts.map(c => c.cropId))];
    const crops = await CropListingModel.find({ _id: { $in: cropIds } }).lean().exec();
    const cropMap = new Map(crops.map(c => [c._id.toString(), c]));

    return contracts.map(c => ({ ...c, crop: cropMap.get(c.cropId.toString()) || null }));
  },

  async findByFarmer(farmerId: string) {
    const contracts = await ContractModel.find({ farmerId }).sort({ createdAt: -1 }).lean().exec();
    const cropIds = [...new Set(contracts.map(c => c.cropId))];
    const crops = await CropListingModel.find({ _id: { $in: cropIds } }).lean().exec();
    const cropMap = new Map(crops.map(c => [c._id.toString(), c]));

    return contracts.map(c => ({ ...c, crop: cropMap.get(c.cropId.toString()) || null }));
  },
};
