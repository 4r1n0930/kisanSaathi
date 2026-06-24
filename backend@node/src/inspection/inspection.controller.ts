import { Request, Response, NextFunction, Router } from 'express';
import { InspectionService } from './inspection.service';

const router = Router();

router.post('/analyze-crop', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ message: 'imageUrl is required' });

    const result = await InspectionService.analyzeCropImage(imageUrl);
    return res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/submit', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { inspectorId, vehiclePhoto, cropPhoto, paymentScreenshot, aiAnalysis } = req.body;
    if (!inspectorId || !vehiclePhoto || !cropPhoto || !paymentScreenshot) {
      return res.status(400).json({ message: 'inspectorId, vehiclePhoto, cropPhoto, and paymentScreenshot are required' });
    }

    const report = await InspectionService.createReport({
      inspectorId,
      vehiclePhoto,
      cropPhoto,
      paymentScreenshot,
      aiAnalysis,
    });

    return res.status(201).json({ message: 'Inspection report submitted', report });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { inspectorId } = req.query;
    let reports;
    if (inspectorId) {
      reports = await InspectionService.findByInspector(inspectorId as string);
    } else {
      reports = await InspectionService.findAll();
    }
    return res.json(reports);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await InspectionService.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Inspection report not found' });
    return res.json(report);
  } catch (error) {
    next(error);
  }
});

export default router;
