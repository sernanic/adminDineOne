import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { useSectionDetails } from './hooks/useSectionDetails';
import { SectionDetails } from './components/SectionDetails';
import { SectionImages } from './components/SectionImages';

function SectionDetailsScreen() {
  const { merchantId, categoryId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const {
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
  } = useSectionDetails({ 
    currentUser, 
    merchantId, 
    sectionId: categoryId 
  });

  if (!currentUser) {
    return <div>Loading authentication...</div>;
  }

  if (!merchantId || !categoryId) {
    console.error('Missing required params:', { merchantId, categoryId });
    navigate('/sections');
    return null;
  }

  if (isLoading) {
    return <div>Loading section details...</div>;
  }

  if (error) {
    console.error('Section details error:', error);
    return (
      <div className="p-4">
        <div className="text-red-500">Error: {error.message}</div>
        <button 
          onClick={() => navigate('/sections')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Sections
        </button>
      </div>
    );
  }

  const handleImageUpload = async (file) => {
    try {
      await addImage(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await deleteImage(imageId);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Sections', link: '/sections' },
    { label: section ? section.name : 'Section Details' },
  ];

  return (
    <div className="p-4">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mt-4">
        <SectionDetails 
          section={section} 
          onSave={editSectionDetails}
        />

        <div className="mt-6">
          <SectionImages
            images={sectionImages}
            onUpload={handleImageUpload}
            onDelete={handleDeleteImage}
            isUploading={isAddingImage}
            isDeleting={isDeletingImage}
          />
        </div>
      </div>
    </div>
  );
}

export default SectionDetailsScreen;
