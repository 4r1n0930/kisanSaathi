import { Router, Response, NextFunction } from 'express';
import multer from 'multer';
import { uploadDocument } from './cloudinary.service';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('document'), async (req, res, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Document file is required' });
    }

    const url = await uploadDocument(file);
    return res.status(201).json({ url });
  } catch (error) {
    next(error);
  }
});

export default router;
