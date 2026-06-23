import { CropMetadataModel } from '../crops/crop.metadata.model';

export async function getMandiPrice(crop: string) {
  const meta = await CropMetadataModel.findOne({ name: crop, active: true }).lean();
  if (meta) {
    return {
      minimum: meta.defaultMinPrice,
      maximum: meta.defaultMaxPrice,
      recommended: meta.defaultRecommendedPrice,
    };
  }
  return { minimum: 0, maximum: 0, recommended: 0 };
}
