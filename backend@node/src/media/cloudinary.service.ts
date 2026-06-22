import { UploadApiResponse } from 'cloudinary';
import cloudinary from '../config/cloudinary.config';

export async function uploadDocument(file: Express.Multer.File, folder = 'kisan_documents') {
  if (!file || !file.buffer) {
    throw new Error('File upload failed or file buffer is missing');
  }

  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error: Error | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          return reject(error);
        }

        if (!result?.secure_url) {
          return reject(new Error('Cloudinary upload did not return a URL'));
        }

        resolve(result.secure_url);
      },
    );

    stream.end(file.buffer);
  });
}
