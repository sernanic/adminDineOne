import axios from 'axios';
import { getAuth } from 'firebase/auth';

const BASE_URL = 'http://127.0.0.1:4000';

const getAuthToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  return user.getIdToken();
};

const getAuthHeaders = async () => {
  const token = await getAuthToken();
  return {
    Authorization: `Bearer ${token}`
  };
};

export const fetchMerchants = async () => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${BASE_URL}/merchants`, { headers });
  return response.data.merchants;
};

export const fetchMerchantById = async (merchantId) => {
  const headers = await getAuthHeaders();
  const response = await axios.get(`${BASE_URL}/merchant/${merchantId}`, { headers });
  return response.data.merchant;
};

export const createMerchant = async (merchantData) => {
  const headers = await getAuthHeaders();
  const response = await axios.post(`${BASE_URL}/merchant/add`, merchantData, { headers });
  return response.data;
};

export const updateMerchant = async (merchantId, merchantData) => {
  const headers = await getAuthHeaders();
  const response = await axios.put(`${BASE_URL}/merchant/${merchantId}`, merchantData, { headers });
  return response.data;
};

export const deleteMerchant = async (merchantId) => {
  const headers = await getAuthHeaders();
  await axios.delete(`${BASE_URL}/merchant/${merchantId}`, { headers });
};
