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
            <ImageUploader onUpload={handleImageUpload} />
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
                  <CarouselItem key={index}>
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
            <div className="absolute inset-y-0 left-0 right-0 pointer-events-none flex items-center justify-between px-4">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
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
