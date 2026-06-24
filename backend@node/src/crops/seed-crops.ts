import dotenv from 'dotenv';
import { connectDatabase } from '../config/database.config';
import { CropMetadataModel } from './crop.metadata.model';

dotenv.config();

const SEED_CROPS = [
  { name: 'Wheat', hindiName: 'गेहूं', defaultMinPrice: 2275, defaultMaxPrice: 2550, defaultRecommendedPrice: 2425 },
  { name: 'Onion', hindiName: 'प्याज', defaultMinPrice: 1200, defaultMaxPrice: 1800, defaultRecommendedPrice: 1500 },
  { name: 'Garlic', hindiName: 'लहसुन', defaultMinPrice: 8000, defaultMaxPrice: 12000, defaultRecommendedPrice: 10000 },
  { name: 'Gram', hindiName: 'चना', defaultMinPrice: 5200, defaultMaxPrice: 5900, defaultRecommendedPrice: 5600 },
  { name: 'Soybean', hindiName: 'सोयाबीन', defaultMinPrice: 4200, defaultMaxPrice: 4800, defaultRecommendedPrice: 4500 },
];

async function seed() {
  await connectDatabase();

  for (const crop of SEED_CROPS) {
    await CropMetadataModel.findOneAndUpdate(
      { name: crop.name },
      { $set: { ...crop, active: true } },
      { upsert: true },
    );
  }

  console.log('Seeded crop metadata successfully');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed', err);
  process.exit(1);
});
