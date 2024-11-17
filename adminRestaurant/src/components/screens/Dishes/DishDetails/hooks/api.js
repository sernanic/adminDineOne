import axios from "axios"

const BASE_URL = 'http://127.0.0.1:4000'

const getHeaders = async (currentUser) => {
  if (!currentUser) {
    throw new Error('Authentication required');
  }
  const token = await currentUser.getIdToken()
  return { 
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
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

export const addDishImage = async ({ merchantId, itemId, imageURL, currentUser }) => {
  const headers = await getHeaders(currentUser);
  const response = await axios.post(
    `${BASE_URL}/item/image`,
    {
      itemId,
      imageURL,
    },
    { headers }
  );
  return response.data;
}

export const deleteDishImage = async ({ merchantId, itemId, imageId, currentUser }) => {
  if (!currentUser) {
    throw new Error('Authentication required');
  }
  const headers = await getHeaders(currentUser)
  try {
    const response = await axios.delete(`${BASE_URL}/item/image/${imageId}`, { 
      headers,
      validateStatus: (status) => {
        return status >= 200 && status < 300;
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const editDish = async ({ dish, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const response = await axios.post(
    `${BASE_URL}/api/item/edit`,
    {
      ...dish,
      description: dish.description || '',
      price: Math.round(parseFloat(dish.price) * 100),
    },
    { headers }
  )
  return response.data
}

export const deleteDish = async ({ merchantId, itemId, currentUser }) => {
  const headers = await getHeaders(currentUser)
  const response = await axios.delete(
    `${BASE_URL}/api/item/${itemId}`,
    { headers }
  )
  return response.data
}
