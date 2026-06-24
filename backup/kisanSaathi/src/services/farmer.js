import { api } from './api';

export async function getReceivedBids(farmerId) {
  const resp = await api.get('/bid/received', { params: { farmerId } });
  return resp.data;
}

export async function selectBid(bidId, farmerId) {
  const resp = await api.patch(`/contracts/select/${bidId}`, { farmerId });
  return resp.data;
}

export async function getContractsByFarmer(farmerId) {
  const resp = await api.get('/contracts', { params: { farmerId } });
  return resp.data;
}
