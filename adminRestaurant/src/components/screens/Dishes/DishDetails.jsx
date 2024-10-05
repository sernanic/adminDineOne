import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import ImageUploader from '../../shared/imageUploader';
import { Plus, Trash2 } from 'lucide-react';
import {Accordion, AccordionItem} from "@nextui-org/react";

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
import { Card, CardHeader, CardBody, CardFooter,Button } from "@nextui-org/react";

// Add these new imports for the Shadcn UI table components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";


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
        <div className="relative w-full max-w-[50%] mx-auto">
          <Card isFooterBlurred className="w-full h-[400px] col-span-12 sm:col-span-7 mb-8">
            <CardBody className="p-0 overflow-hidden">
              {dishImages.length > 0 ? (
                <Carousel className="w-full h-full">
                  <CarouselContent>
                    {dishImages.map((image, index) => (
                      <CarouselItem key={index} className="relative">
                        <img src={image.imageUrl} alt={`Dish ${index + 1}`} className="w-full h-full object-cover" />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {dishImages.length > 1 && (
                    <>
                      <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2" />
                      <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                    </>
                  )}
                </Carousel>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <p>No images available</p>
                </div>
              )}
            </CardBody>
            <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
              <div className="flex flex-col flex-grow text-white">
                <h4 className="text-white font-semibold text-lg mb-1">{dishData.name}</h4>
                <p className="text-tiny">Item ID: {itemId}</p>
                <p className="text-tiny">Price: ${(dishData.price / 100).toFixed(2)}</p>
                <p className="text-tiny">Available: {dishData.available ? "Yes" : "No"}</p>
                <p className="text-tiny">Hidden: {dishData.hidden ? "Yes" : "No"}</p>
              </div>
              <div className="flex space-x-2">
                {dishImages.length < 6 && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        color="default" 
                        variant="solid" 
                        size="sm" 
                        startContent={<Plus size={16} />}
                        className="bg-black text-white"
                      >
                        Add Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Image</DialogTitle>
                      </DialogHeader>
                      <ImageUploader onImageUploaded={addDishImage} bucketName="itemImages" />
                    </DialogContent>
                  </Dialog>
                )}
                {dishImages.length > 0 && (
                  <Button
                    size="sm"
                    color="danger"
                    variant="solid"
                    onClick={() => handleDeleteImage(dishImages[0].id)}
                    startContent={<Trash2 size={16} />}
                    className="font-semibold"
                  >
                    Delete Image
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      <Accordion variant="splitted" className="max-w-[70%] mx-auto mt-8">
        {modifierGroups.map((group) => (
          <AccordionItem key={group.id} aria-label={group.name} title={group.name}>
            <Table>
              <TableCaption>{group.name} Modifiers</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Modified Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.modifiers.map((modifier) => (
                  <TableRow key={modifier.id}>
                    <TableCell>{modifier.name}</TableCell>
                    <TableCell>${modifier.price.toFixed(2)}</TableCell>
                    <TableCell>{modifier.available ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{new Date(modifier.modifiedTime).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default DishDetails;