import { Request, Response, NextFunction, Router } from 'express';
import { ContractService } from './contract.service';

const router = Router();

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contract = await ContractService.findById(req.params.id);
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    return res.json(contract);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { farmerId, traderId } = req.query;
    let contracts;
    if (farmerId) {
      contracts = await ContractService.findByFarmer(farmerId as string);
    } else if (traderId) {
      contracts = await ContractService.findByTrader(traderId as string);
    } else {
      return res.status(400).json({ message: 'farmerId or traderId is required' });
    }
    return res.json(contracts);
  } catch (error) {
    next(error);
  }
});

router.patch('/select/:bidId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { farmerId } = req.body;
    if (!farmerId) return res.status(400).json({ message: 'farmerId is required' });
    const contract = await ContractService.selectBid(req.params.bidId, farmerId);
    return res.status(201).json({ message: 'Deal sent to trader for confirmation', contract });
  } catch (error) {
    next(error);
  }
});

router.patch('/:contractId/accept', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { traderId } = req.body;
    if (!traderId) return res.status(400).json({ message: 'traderId is required' });
    const contract = await ContractService.acceptContract(req.params.contractId, traderId);
    return res.json({ message: 'Contract confirmed', contract });
  } catch (error) {
    next(error);
  }
});

router.patch('/:contractId/reject', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { traderId } = req.body;
    if (!traderId) return res.status(400).json({ message: 'traderId is required' });
    const contract = await ContractService.rejectContract(req.params.contractId, traderId);
    return res.json({ message: 'Deal rejected', contract });
  } catch (error) {
    next(error);
  }
});

export default router;
