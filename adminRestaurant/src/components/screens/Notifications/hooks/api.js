import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000'

const getHeaders = async (currentUser) => {
  const token = await currentUser.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

export const fetchNotifications = async ({ merchantId, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const response = await axios.get(`${BASE_URL}/notifications/${merchantId}`, { headers })
  return response.data.data
}

export const createNotification = async ({ notification, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const response = await axios.post(`${BASE_URL}/notifications/`, notification, { headers })
  return response.data.data
}

export const updateNotification = async ({ notification, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const response = await axios.put(`${BASE_URL}/notifications/${notification.id}`, notification, { headers })
  return response.data.data
}

export const deleteNotification = async ({ notificationId, currentUser }) => {
  const headers = await getHeaders(currentUser)
  await axios.delete(`${BASE_URL}/notifications/${notificationId}`, { headers })
}
