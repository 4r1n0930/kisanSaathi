import { Request, Response, NextFunction, Router } from 'express';
import { MarketService } from './market.service';

const router = Router();

router.get('/prices', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const crop = (req.query.crop as string) || 'Wheat';
    const prices = await MarketService.getPrices(crop);
    return res.json(prices);
  } catch (error) {
    next(error);
  }
});

export default router;
