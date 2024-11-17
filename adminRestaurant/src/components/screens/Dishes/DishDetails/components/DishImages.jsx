import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  Button
} from "@nextui-org/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageUploader from '@/components/shared/imageUploader';

export function DishImages({ 
  dishImages, 
  isImagesLoading, 
  imagesError, 
  isDialogOpen, 
  setIsDialogOpen,
  handleImageUpload,
  handleDeleteImage,
  isDeletingImage,
  dish
}) {
  const onImageUploaded = (imageURL) => {
    handleImageUpload(imageURL);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-xl font-semibold">Images</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              color="primary" 
              endContent={<Plus className="h-4 w-4" />}
              size="sm"
            >
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Image</DialogTitle>
            </DialogHeader>
            <ImageUploader onImageUploaded={onImageUploaded} bucketName="itemImages"/>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardBody className="p-6">
        {isImagesLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : imagesError ? (
          <div className="text-center text-red-500 p-4">
            Error loading images: {imagesError.message}
          </div>
        ) : dishImages?.length > 0 ? (
          <div className="relative w-full">
            <Carousel className="w-full">
              <CarouselContent>
                {dishImages.map((image, index) => (
                  <CarouselItem key={image.id || index}>
                    <div className="relative aspect-video">
                      <img
                        src={image.imageUrl}
                        alt={`${dish?.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <Button
                        isIconOnly
                        color="danger"
                        className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
                        onClick={() => handleDeleteImage(image.id)}
                        isLoading={isDeletingImage}
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 border-0" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 border-0" />
            </Carousel>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
