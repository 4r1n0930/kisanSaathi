import axios from 'axios';

const PY_AI = process.env.PYTHON_AI_URL || '';

export async function analyzeCropWithPython(crop: string, images: string[], location?: string) {
  if (!PY_AI) throw new Error('PYTHON_AI_URL not configured');

  const url = `${PY_AI.replace(/\/$/, '')}/analyze-crop`;
  const resp = await axios.post(url, { crop, images, location }, { timeout: 60000 });
  return resp.data;
}
