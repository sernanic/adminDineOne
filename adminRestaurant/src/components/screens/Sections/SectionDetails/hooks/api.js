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

export const fetchSectionDetails = async ({ merchantId, sectionId, currentUser }) => {
  if (!merchantId || !sectionId) {
    throw new Error('Missing required parameters: merchantId and sectionId');
  }
  const headers = await getHeaders(currentUser)
  const response = await axios.get(`${BASE_URL}/category/${merchantId}/${sectionId}`, { headers })
  return response.data.category
}

export const fetchSectionImages = async ({ merchantId, sectionId, currentUser }) => {
  if (!merchantId || !sectionId) {
    throw new Error('Missing required parameters: merchantId and sectionId');
  }
  const headers = await getHeaders(currentUser)
  const response = await axios.get(`${BASE_URL}/category/${sectionId}/image`, { headers })
  return response.data.categoryImage
}

export const addSectionImage = async ({ merchantId, sectionId, imageURL, currentUser }) => {
  if (!merchantId || !sectionId) {
    throw new Error('Missing required parameters: merchantId and sectionId');
  }
  const headers = await getHeaders(currentUser);
  const response = await axios.post(
    `${BASE_URL}/category/image`,
    {
      categoryId: sectionId,
      imageURL,
    },
    { headers }
  );
  return response.data.categoryImage;
}

export const deleteSectionImage = async ({ merchantId, sectionId, imageId, currentUser }) => {
  if (!merchantId || !sectionId || !imageId) {
    throw new Error('Missing required parameters: merchantId, sectionId, or imageId');
  }
  const headers = await getHeaders(currentUser)
  try {
    const response = await axios.delete(
      `${BASE_URL}/category/image/${sectionId}`, 
      { 
        headers,
        validateStatus: (status) => {
          return status >= 200 && status < 300;
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export const editSection = async ({ merchantId, sectionId, section, currentUser }) => {
  if (!merchantId || !sectionId) {
    throw new Error('Missing required parameters: merchantId and sectionId');
  }
  const headers = await getHeaders(currentUser)
  const response = await axios.put(
    `${BASE_URL}/category/${merchantId}/${sectionId}`,
    section,
    { headers }
  )
  return response.data.category
}

export const deleteSection = async ({ merchantId, sectionId, currentUser }) => {
  if (!merchantId || !sectionId) {
    throw new Error('Missing required parameters: merchantId and sectionId');
  }
  const headers = await getHeaders(currentUser)
  const response = await axios.delete(
    `${BASE_URL}/category/${merchantId}/${sectionId}`,
    { headers }
  )
  return response.data
}
