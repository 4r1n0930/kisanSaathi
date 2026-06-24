import { api } from './api';

export async function registerFarmer(payload) {
  return api.post('/auth/register', payload).then((response) => response.data);
}

export async function registerTrader(payload) {
  return api.post('/auth/register', payload).then((response) => response.data);
}

export async function registerInspector(payload) {
  return api.post('/auth/register', payload).then((response) => response.data);
}

export async function login(email, password) {
  return api.post('/auth/login', { email, password }).then((response) => response.data);
}
