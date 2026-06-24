import { Platform } from 'react-native';

const DEVICE_IP = "10.104.209.172";

const getBaseUrl = () => {
  if (DEVICE_IP) {
    return `http://${DEVICE_IP}:5000`;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  return 'http://localhost:5000';
};

export const API_BASE_URL = getBaseUrl();
export const PORT = 5000;
