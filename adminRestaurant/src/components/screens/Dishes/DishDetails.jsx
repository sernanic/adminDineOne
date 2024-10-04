import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import ImageUploader from '../../shared/imageUploader';
import { Pencil, Trash2 } from 'lucide-react';
// ... existing imports ...

// Add these new imports
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function DishDetails() {
  const { merchantId, itemId } = useParams();
  const [dishData, setDishData] = useState(null);
  const [dishImages, setDishImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [modifierGroups, setModifierGroups] = useState([]);

  useEffect(() => {
    const fetchDishDetails = async () => {
      try {
        const [dishResponse, imagesResponse, modifierGroupsResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:4000/item/${merchantId}/${itemId}`),
          axios.get(`http://127.0.0.1:4000/item/${itemId}/images`),
          axios.get(`http://127.0.0.1:4000/item/${merchantId}/${itemId}/modifierGroups`)
        ]);

        console.log("dishResponse", dishResponse);
        console.log("imagesResponse", imagesResponse.data.itemImages);
        console.log("modifierGroupsResponse", modifierGroupsResponse.data.modifierGroups);

        setDishData(dishResponse.data.item);
        setDishImages(imagesResponse.data.itemImages || []); // Ensure it's always an array
        setModifierGroups(modifierGroupsResponse.data.modifierGroups || []);
        setIsLoading(false);
        
      } catch (error) {
        console.error("Error fetching dish details:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchDishDetails();
  }, [itemId, merchantId]);

  const addDishImage = async (imageURL) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const token = await user.getIdToken();

      const response = await axios.post('http://127.0.0.1:4000/item/image', {
        itemId: itemId,
        imageURL: imageURL
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Dish image added:', response.data);
      setDishImages([...dishImages, { imageURL: imageURL }]);
      setIsDialogOpen(false); // Close the dialog after successful upload
    } catch (error) {
      console.error('Error adding dish image:', error);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const token = await user.getIdToken();

      await axios.delete(`http://127.0.0.1:4000/item/image/${imageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setDishImages(dishImages.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error deleting dish image:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Dish Details</h1>
      {dishData && (
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="w-1/6"></div> {/* Spacer */}
            <div className="w-2/3 max-w-2xl">
              {dishImages.length > 0 ? (
                <Carousel>
                  <CarouselContent>
                    {dishImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative">
                          <img src={image.imageUrl} alt={`Dish ${index + 1}`} className="w-full h-60 object-cover" />
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <p>No images available</p>
              )}
            </div>
            
            <div className="w-1/6 flex justify-end">
              {dishImages.length < 6 && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Add Image</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Image</DialogTitle>
                    </DialogHeader>
                    <ImageUploader onImageUploaded={addDishImage} bucketName="itemImages" />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 info-container">
            <h2 className="text-xl font-semibold mb-2">{dishData.name}</h2>
            <p>Item ID: {itemId}</p>
            <p>Price: ${(dishData.price / 100).toFixed(2)}</p>
            <p>Available: {dishData.available ? "Yes" : "No"}</p>
            <p>Hidden: {dishData.hidden ? "Yes" : "No"}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DishDetails;