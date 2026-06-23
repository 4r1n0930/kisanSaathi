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
