import { CropListingModel, ICropListing } from './crop.model';

export const CropRepository = {
  async create(listing: Partial<ICropListing>) {
    const doc = await CropListingModel.create(listing);
    return doc;
  },
  async findById(id: string) {
    return CropListingModel.findById(id).exec();
  },
  async findAllAvailable() {
    return CropListingModel.find({ status: 'ACTIVE' }).sort({ createdAt: -1 }).exec();
  },
};
