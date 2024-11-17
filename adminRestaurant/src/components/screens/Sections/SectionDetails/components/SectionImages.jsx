import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardBody,
  Button
} from "@nextui-org/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageUploader from '@/components/shared/imageUploader';

export const SectionImages = ({ 
  images, 
  onUpload, 
  onDelete,
  isUploading,
  isDeleting 
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleImageUploaded = (imageURL) => {
    onUpload(imageURL);
    setIsDialogOpen(false);
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
            <ImageUploader onImageUploaded={handleImageUploaded} bucketName="categoryImages"/>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardBody className="p-6">
        <div className="grid grid-cols-3 gap-4">
          {images?.map((image, index) => (
            <div key={image.id || index} className="relative group">
              <img
                src={image.imageURL}
                alt={`Section image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => e.target.src = 'https://via.placeholder.com/150'}
              />
              <Button
                isIconOnly
                color="danger"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/80 backdrop-blur-sm"
                onClick={() => onDelete(image.id)}
                isLoading={isDeleting}
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
