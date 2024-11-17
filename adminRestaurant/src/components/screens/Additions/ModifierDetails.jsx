import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import { useModifierDetails } from "@/hooks/useModifierDetails";
import { ModifierHeader } from "@/components/screens/Additions/ModifierDetails/components/ModifierHeader";
import { ModifierImages } from "@/components/screens/Additions/ModifierDetails/components/ModifierImages";
import { ModifierDetailsCard } from "@/components/screens/Additions/ModifierDetails/components/ModifierDetails";

function ModifierDetails() {
  const { merchantId, modifierId } = useParams();
  const { currentUser } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const {
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
  } = useModifierDetails({ currentUser, merchantId, modifierId });

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Additions', link: '/additions' },
    { label: modifier ? modifier.name : 'Modifier Details' },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <ModifierHeader
            modifier={modifier}
            onEdit={editModifierDetails}
          />
          
          <ModifierDetailsCard
            modifier={modifier}
            className="mt-6"
          />
        </div>

        <div className="md:col-span-4">
          <ModifierImages
            images={modifierImages}
            isLoading={isImagesLoading}
            error={imagesError}
            onAdd={addImage}
            onDelete={deleteImage}
            isAddingImage={isAddingImage}
            isDeletingImage={isDeletingImage}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(ModifierDetails);
