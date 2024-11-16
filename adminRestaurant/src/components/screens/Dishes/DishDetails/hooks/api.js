import axios from "axios"

const BASE_URL = 'http://127.0.0.1:4000'

const getHeaders = async (currentUser) => {
  const token = await currentUser.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

export const fetchDishDetails = async ({ merchantId, itemId, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const response = await axios.get(`${BASE_URL}/item/${merchantId}/${itemId}`, { headers })
  return response.data.item
}

export const fetchDishImages = async ({ merchantId, itemId, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const response = await axios.get(`${BASE_URL}/item/${itemId}/images`, { headers })
  return response.data.itemImages || []
}

export const addDishImage = async ({ merchantId, itemId, imageFile, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const formData = new FormData()
  formData.append('image', imageFile)
  formData.append('merchantId', merchantId)
  formData.append('itemId', itemId)
  
  const response = await axios.post(
    `${BASE_URL}/item/image`, 
    formData, 
    { 
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  return response.data
}

export const deleteDishImage = async ({ merchantId, itemId, imageId, currentUser }) => {
  const headers = await getHeaders(currentUser)
  await axios.delete(`${BASE_URL}/item/image/${imageId}`, { headers })
}
