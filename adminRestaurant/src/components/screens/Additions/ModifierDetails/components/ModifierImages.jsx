import React from 'react';
import { Card, CardBody, CardHeader, Image, Button } from "@nextui-org/react";
import { Plus, Trash2 } from "lucide-react";
import ImageUploader from '@/components/shared/imageUploader';

export function ModifierImages({
  images,
  isLoading,
  error,
  onAdd,
  onDelete,
  isAddingImage,
  isDeletingImage,
  isDialogOpen,
  setIsDialogOpen
}) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardBody className="h-[300px] flex items-center justify-center">
          <div className="loading-spinner"></div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardBody className="p-4">
          <p className="text-red-500">Error loading images: {error.message}</p>
        </CardBody>
      </Card>
    );
  }

  const hasImage = images && images.length > 0 && images[0].imageURL;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
        <h2 className="text-lg font-semibold">Image</h2>
        {!hasImage && (
          <Button
            size="sm"
            color="primary"
            variant="flat"
            startContent={<Plus size={16} />}
            onClick={() => setIsDialogOpen(true)}
            isLoading={isAddingImage}
          >
            Add Image
          </Button>
        )}
      </CardHeader>

      <CardBody className="px-4 py-3">
        {hasImage ? (
          <div className="relative group">
            <Image
              src={images[0].imageURL}
              alt="Modifier image"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color="primary"
                  variant="flat"
                  startContent={<Plus size={16} />}
                  onClick={() => setIsDialogOpen(true)}
                  isLoading={isAddingImage}
                >
                  Change
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  startContent={<Trash2 size={16} />}
                  onClick={() => onDelete(images[0].id)}
                  isLoading={isDeletingImage}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-gray-500 mb-4">No image added yet</p>
            <Button
              size="sm"
              color="primary"
              variant="flat"
              startContent={<Plus size={16} />}
              onClick={() => setIsDialogOpen(true)}
              isLoading={isAddingImage}
            >
              Add Image
            </Button>
          </div>
        )}
      </CardBody>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
            <ImageUploader
              onImageUploaded={onAdd}
              bucketName="modifierImages"
              onClose={() => setIsDialogOpen(false)}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
