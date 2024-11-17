import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export function useModifierDetails({ currentUser, merchantId, modifierId }) {
  const [modifier, setModifier] = useState(null);
  const [modifierImages, setModifierImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesError, setImagesError] = useState(null);
  const [isImagesLoading, setIsImagesLoading] = useState(true);
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const fetchModifierDetails = useCallback(async () => {
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();
      const response = await axios.get(
        `http://127.0.0.1:4000/merchant/${merchantId}/modifier/${modifierId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setModifier(response.data.modifier);
      setError(null);
    } catch (err) {
      console.error('Error fetching modifier details:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, merchantId, modifierId]);

  const fetchModifierImages = useCallback(async () => {
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();
      const response = await axios.get(
        `http://127.0.0.1:4000/modifier/${modifierId}/image`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // The endpoint returns { modifierImage: { id, modifierId, imageURL } } or { modifierImage: null }
      const image = response.data.modifierImage;
      setModifierImages(image ? [image] : []);
      setImagesError(null);
    } catch (err) {
      console.error('Error fetching modifier images:', err);
      setImagesError(err);
    } finally {
      setIsImagesLoading(false);
    }
  }, [currentUser, modifierId]);

  const addImage = async (imageURL) => {
    if (!currentUser) return;
    setIsAddingImage(true);

    try {
      const token = await currentUser.getIdToken();
      await axios.post(
        'http://127.0.0.1:4000/modifier/image',
        {
          modifierId,
          imageURL // The backend expects imageURL here
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      await fetchModifierImages();
    } catch (err) {
      console.error('Error adding modifier image:', err);
      throw err;
    } finally {
      setIsAddingImage(false);
    }
  };

  const deleteImage = async (imageId) => {
    if (!currentUser) return;
    setIsDeletingImage(true);

    try {
      const token = await currentUser.getIdToken();
      await axios.delete(
        `http://127.0.0.1:4000/modifier/${modifierId}/image/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      await fetchModifierImages();
    } catch (err) {
      console.error('Error deleting modifier image:', err);
      throw err;
    } finally {
      setIsDeletingImage(false);
    }
  };

  const editModifierDetails = async (updatedModifier) => {
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken();
      await axios.put(
        `http://127.0.0.1:4000/merchant/${merchantId}/modifier/${modifierId}`,
        updatedModifier,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      await fetchModifierDetails();
    } catch (err) {
      console.error('Error updating modifier details:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (currentUser && merchantId && modifierId) {
      fetchModifierDetails();
      fetchModifierImages();
    }
  }, [currentUser, merchantId, modifierId, fetchModifierDetails, fetchModifierImages]);

  return {
    modifier,
    modifierImages,
    isLoading,
    error,
    imagesError,
    isImagesLoading,
    addImage,
    deleteImage,
    isAddingImage,
    isDeletingImage,
    editModifierDetails
  };
}
