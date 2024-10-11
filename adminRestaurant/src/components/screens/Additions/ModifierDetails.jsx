import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import ImageUploader from '../../shared/imageUploader';
import { Pencil, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

const ModifierDetails = () => {
  const { merchantId, modifierId } = useParams();
  const [modifier, setModifier] = useState(null);
  const [modifierImage, setModifierImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchModifierDetails = useCallback(async () => {
    try {
      const [modifierResponse, imageResponse] = await Promise.all([
        axios.get(`http://127.0.0.1:4000/merchant/${merchantId}/modifier/${modifierId}`),
        axios.get(`http://127.0.0.1:4000/modifier/${modifierId}/image`)
      ]);
      setModifier(modifierResponse.data.modifier);
      setModifierImage(imageResponse.data.modifierImage);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching modifier details:", error);
      setError(error);
      setIsLoading(false);
    }
  }, [merchantId, modifierId]);

  useEffect(() => {
    fetchModifierDetails();
  }, [fetchModifierDetails]);

  const addModifierImage = async (imageURL) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const token = await user.getIdToken();

      const response = await axios.post('http://127.0.0.1:4000/modifier/image', {
        modifierId: modifierId,
        imageURL: imageURL
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        validateStatus: function (status) {
          return status < 500;
        }
      });

      console.log('Modifier image added:', response.data);
      setModifierImage({ imageURL: imageURL });
    } catch (error) {
      console.error('Error adding modifier image:', error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  const handleEditImage = () => {
    // Implement edit functionality here
    console.log('Edit image');
  };

  const handleDeleteImage = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const token = await user.getIdToken();

      await axios.delete(`http://127.0.0.1:4000/modifier/${modifierId}/image`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setModifierImage(null);
    } catch (error) {
      console.error('Error deleting modifier image:', error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Additions', link: '/additions' },
    { label: 'Modifier Details' },
  ];

  return (
    <div className="flex flex-col w-full h-full p-4">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex justify-center items-center mt-4" style={{width: '100%', height: '100%'}}>
        <div className="bg-white rounded-lg p-4" style={{width: '95%', height: '100%'}}>
          <Card isFooterBlurred className="w-full max-w-[50%] mx-auto h-[300px] col-span-12 sm:col-span-7 mb-8">
            <CardHeader className="absolute z-10 top-1 flex-col items-start"></CardHeader>
            {modifierImage ? (
              <Image
                removeWrapper
                alt="Modifier Image"
                className="z-0 w-full h-full object-cover"
                src={modifierImage.imageURL}
              />
            ) : (
              <div className="z-0 w-full h-full flex items-center justify-center bg-gray-200">
                <ImageUploader onImageUploaded={addModifierImage} bucketName="modifierImages" />
              </div>
            )}
            <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
              <div className="flex flex-col flex-grow">
                <h4 className="text-white font-semibold text-lg mb-1">{modifier.name}</h4>
                <div className="flex flex-col text-white">
                  <p className="text-tiny">Modifier ID: {modifierId}</p>
                  <p className="text-tiny">Price: ${modifier.price.toFixed(2)}</p>
                  <p className="text-tiny">Available: {modifier.available ? "Yes" : "No"}</p>
                </div>
              </div>
              {modifierImage && (
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleEditImage} startContent={<Pencil size={16} />}>
                    Edit
                  </Button>
                  <Button size="sm" color="danger" onClick={handleDeleteImage} startContent={<Trash2 size={16} />}>
                    Delete
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
          
          <h3 className="text-xl font-semibold mb-2">Additional Modifier Details</h3>
          {modifier && (
            <div>
              <p><strong>Modified Time:</strong> {new Date(modifier.modifiedTime).toLocaleString()}</p>
              {/* Add more details as needed */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ModifierDetails);