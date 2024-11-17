import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchSectionDetails, 
  fetchSectionImages, 
  addSectionImage, 
  deleteSectionImage,
  editSection,
  deleteSection 
} from './api';

export const useSectionDetails = ({ currentUser, merchantId, sectionId }) => {
  const queryClient = useQueryClient();

  // Ensure we have the required params
  if (!merchantId || !sectionId) {
    console.error('Missing required params:', { merchantId, sectionId });
    return {
      section: null,
      sectionImages: [],
      isLoading: false,
      error: new Error('Missing required parameters'),
      imagesError: null,
      isImagesLoading: false,
      addImage: () => Promise.reject(new Error('Missing required parameters')),
      deleteImage: () => Promise.reject(new Error('Missing required parameters')),
      isAddingImage: false,
      isDeletingImage: false,
      editSectionDetails: () => Promise.reject(new Error('Missing required parameters')),
      deleteSectionDetails: () => Promise.reject(new Error('Missing required parameters')),
    };
  }

  // Fetch section details
  const { 
    data: section,
    isLoading,
    error 
  } = useQuery({
    queryKey: ['section', merchantId, sectionId],
    queryFn: () => fetchSectionDetails({ merchantId, sectionId, currentUser }),
    enabled: !!merchantId && !!sectionId && !!currentUser,
  });

  // Fetch section images
  const {
    data: sectionImages = [],
    isLoading: isImagesLoading,
    error: imagesError
  } = useQuery({
    queryKey: ['section-images', merchantId, sectionId],
    queryFn: async () => {
      const image = await fetchSectionImages({ merchantId, sectionId, currentUser });
      return image ? [image] : [];
    },
    enabled: !!merchantId && !!sectionId && !!currentUser,
  });

  // Add image mutation
  const { mutateAsync: addImage, isPending: isAddingImage } = useMutation({
    mutationFn: (imageURL) => 
      addSectionImage({ merchantId, sectionId, imageURL, currentUser }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-images', merchantId, sectionId] });
    },
  });

  // Delete image mutation
  const { mutateAsync: deleteImage, isPending: isDeletingImage } = useMutation({
    mutationFn: (imageId) => 
      deleteSectionImage({ merchantId, sectionId, imageId, currentUser }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-images', merchantId, sectionId] });
    },
  });

  // Edit section mutation
  const { mutateAsync: editSectionDetails } = useMutation({
    mutationFn: (sectionData) => 
      editSection({ 
        merchantId, 
        sectionId, 
        section: sectionData, 
        currentUser 
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section', merchantId, sectionId] });
    },
  });

  // Delete section mutation
  const { mutateAsync: deleteSectionDetails } = useMutation({
    mutationFn: () => deleteSection({ merchantId, sectionId, currentUser }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });

  return {
    section,
    sectionImages,
    isLoading,
    error,
    imagesError,
    isImagesLoading,
    addImage,
    deleteImage,
    isAddingImage,
    isDeletingImage,
    editSectionDetails,
    deleteSectionDetails
  };
};
