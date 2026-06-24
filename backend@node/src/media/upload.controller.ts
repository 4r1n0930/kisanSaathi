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
    return res.status(201).json({ documentUrl: url });
  } catch (error) {
    next(error);
  }
});

export default router;

// Upload multiple crop images and return array of URLs
router.post('/upload-crop-images', upload.array('images', 6), async (req, res, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadDocument(file, 'kisan_crops');
      urls.push(url);
    }

    return res.status(201).json({ images: urls });
  } catch (error) {
    next(error);
  }
});
