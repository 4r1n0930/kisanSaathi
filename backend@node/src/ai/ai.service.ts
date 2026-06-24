import { analyzeCropWithPython } from './ai.client';

export class NodeAiService {
  static async analyzeCrop(crop: string, images: string[], location?: string) {
    // Forward to Python AI microservice
    const data = await analyzeCropWithPython(crop, images, location);
    return data;
  }
}
