import { api } from './api';

export async function getAvailableCrops() {
  const resp = await api.get('/crops/available');
  return resp.data;
}

export async function createBid(payload) {
  const resp = await api.post('/bid/create', payload);
  return resp.data;
}

export async function getMyBids(traderId) {
  const params = traderId ? { traderId } : {};
  const resp = await api.get('/bid/my-bids', { params });
  return resp.data;
}

export async function getMarketPrices(crop) {
  const resp = await api.get('/market/prices', { params: { crop } });
  return resp.data;
}

export async function getContractsByTrader(traderId) {
  const resp = await api.get('/contracts', { params: { traderId } });
  return resp.data;
}

export async function getContractById(contractId) {
  const resp = await api.get(`/contracts/${contractId}`);
  return resp.data;
}

export async function acceptContract(contractId, traderId) {
  const resp = await api.patch(`/contracts/${contractId}/accept`, { traderId });
  return resp.data;
}

export async function rejectContract(contractId, traderId) {
  const resp = await api.patch(`/contracts/${contractId}/reject`, { traderId });
  return resp.data;
}

