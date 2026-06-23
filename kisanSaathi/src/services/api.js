import axios from 'axios';
import { API_BASE_URL } from '../config';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export async function uploadDocumentFile(file) {
  const formData = new FormData();
  formData.append('document', {
    uri: file.uri,
    type: file.type,
    name: file.name,
  });

  const response = await api.post('/media/', formData);
  return response.data.documentUrl;
}

export async function uploadCropImages(files) {
  const formData = new FormData();
  files.forEach((f, idx) => {
    formData.append('images', {
      uri: f.uri,
      type: f.type,
      name: f.name || `image_${idx}.jpg`,
    });
  });

  const response = await api.post('/media/upload-crop-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });

  return response.data.images;
}

export async function createCropListing(payload) {
  const response = await api.post('/crops/create', payload);
  return response.data;
}

export async function getCropMetadata() {
  const response = await api.get('/crops/meta');
  return response.data;
}
