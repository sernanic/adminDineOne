import axios from "axios"

const BASE_URL = 'http://127.0.0.1:4000'

const getHeaders = async (currentUser) => {
  const token = await currentUser.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

export const fetchFeatures = async ({ merchantId, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const response = await axios.get(`${BASE_URL}/features/${merchantId}`, { headers })
  return response.data.data.features
}

export const createFeature = async ({ feature, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const response = await axios.post(`${BASE_URL}/features/`, feature, { headers })
  return response.data
}

export const updateFeature = async ({ feature, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const response = await axios.put(`${BASE_URL}/features/${feature.id}`, feature, { headers })
  return response.data
}

export const deleteFeature = async ({ featureId, currentUser }) => {
  const headers = await getHeaders(currentUser)
  await axios.delete(`${BASE_URL}/features/${featureId}`, { headers })
}
