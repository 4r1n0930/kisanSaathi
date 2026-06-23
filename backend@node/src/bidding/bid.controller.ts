import { Request, Response, NextFunction, Router } from 'express';
import { BidService } from './bid.service';

const router = Router();

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cropId, price, quantity, traderId } = req.body;
    if (!cropId || !price || !quantity) {
      return res.status(400).json({ message: 'cropId, price and quantity are required' });
    }
    const bid = await BidService.create({ cropId, price, quantity, traderId });
    return res.status(201).json(bid);
  } catch (error) {
    next(error);
  }
});

router.get('/my-bids', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const traderId = req.query.traderId as string | undefined;
    const bids = await BidService.findByTrader(traderId);
    return res.json(bids);
  } catch (error) {
    next(error);
  }
});

export default router;
