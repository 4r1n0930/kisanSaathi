import { Request, Response, NextFunction, Router } from 'express';
import { CropService } from './crop.service';
import { CropRepository } from './crop.repository';
import { CropMetadataModel } from './crop.metadata.model';

const router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { farmerId, cropName, quantity, images, location, expectedPrice } = req.body;
    if (!farmerId || !cropName || !quantity || !images || images.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const listing = await CropService.createListing({ farmerId, cropName, quantity, images, location, expectedPrice });
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
});

router.get('/available', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const crops = await CropRepository.findAllAvailable();
    return res.json(crops);
  } catch (error) {
    next(error);
  }
});

router.get('/meta', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const crops = await CropMetadataModel.find({ active: true }).lean();
    return res.json(crops);
  } catch (error) {
    next(error);
  }
});

export default router;
