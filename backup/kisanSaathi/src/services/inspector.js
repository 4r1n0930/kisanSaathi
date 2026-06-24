import { api, uploadDocumentFile } from './api';

export async function uploadInspectionPhoto(photo) {
  return uploadDocumentFile(photo);
}

export async function analyzeCropImage(imageUrl) {
  const response = await api.post('/inspections/analyze-crop', { imageUrl });
  return response.data;
}

export async function submitInspectionReport(data) {
  const response = await api.post('/inspections/submit', data);
  return response.data;
}

export async function getInspections(inspectorId) {
  const response = await api.get(`/inspections?inspectorId=${inspectorId}`);
  return response.data;
}

export async function getInspectionById(id) {
  const response = await api.get(`/inspections/${id}`);
  return response.data;
}
