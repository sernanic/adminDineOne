import axios from "axios"

const BASE_URL = 'http://127.0.0.1:4000'

const getHeaders = async (currentUser) => {
  const token = await currentUser.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

export const fetchRewards = async ({ merchantId, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const response = await axios.get(`${BASE_URL}/rewards/${merchantId}`, { headers })
  return response.data.rewards
}

export const createReward = async ({ reward, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const response = await axios.post(`${BASE_URL}/rewards/`, reward, { headers })
  return response.data
}

export const updateReward = async ({ reward, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const response = await axios.put(`${BASE_URL}/rewards/${reward.id}`, reward, { headers })
  return response.data
}

export const deleteReward = async ({ rewardId, currentUser }) => {
  const headers = await getHeaders(currentUser)
  await axios.delete(`${BASE_URL}/rewards/${rewardId}`, { headers })
}
