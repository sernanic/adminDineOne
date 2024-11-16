import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { useDishDetails } from './hooks/useDishDetails';
import { DishHeader } from './components/DishHeader';
import { DishImages } from './components/DishImages';
import { DishDetailsCard } from './components/DishDetails';

function DishDetails() {
  const { merchantId, itemId } = useParams();
  const { currentUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const {
    dish,
    dishImages,
    isLoading,
    error,
    imagesError,
    isImagesLoading,
    addImage,
    deleteImage,
    isAddingImage,
    isDeletingImage
  } = useDishDetails({ currentUser, merchantId, itemId });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleImageUpload = async (file) => {
    addImage(file);
    setIsDialogOpen(false);
  };

  const handleDeleteImage = async (imageId) => {
    deleteImage(imageId);
  };

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Dishes', link: '/dishes' },
    { label: dish ? dish.name : 'Dish Details' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      
      {/* Main Content */}
      <div className="mt-8 space-y-6">
        <DishHeader dish={dish} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DishImages 
            dish={dish}
            dishImages={dishImages}
            isImagesLoading={isImagesLoading}
            imagesError={imagesError}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleImageUpload={handleImageUpload}
            handleDeleteImage={handleDeleteImage}
            isDeletingImage={isDeletingImage}
          />
          
          <DishDetailsCard dish={dish} />
        </div>
      </div>
    </div>
  );
}

export default DishDetails;
