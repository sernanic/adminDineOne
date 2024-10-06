import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import ImageUploader from '../../shared/imageUploader';
import { Pencil, Trash2 } from 'lucide-react'; // Import the icons
import { Card, CardHeader, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import Breadcrumbs from "@/components/shared/Breadcrumbs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SectionDetails() {
  const { merchantId, categoryId } = useParams();
  const [sectionData, setSectionData] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSectionDetails = async () => {
      try {
        const [sectionResponse, itemsResponse, imageResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:4000/category/${merchantId}/${categoryId}`),
          axios.get(`http://127.0.0.1:4000/category/${merchantId}/${categoryId}/items`),
          axios.get(`http://127.0.0.1:4000/category/${categoryId}/image`)
        ]);

        setSectionData({
          category: sectionResponse.data.category,
          items: itemsResponse.data.items
        });
        setCategoryImage(imageResponse.data.categoryImage);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching section details:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchSectionDetails();
  }, [categoryId, merchantId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "price", header: "Price" },
    { accessorKey: "defaultTaxRates", header: "Default Tax Rates" },
    { accessorKey: "id", header: "ID" },
  ];

  const addCategoryImage = async (imageURL) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }

      const token = await user.getIdToken();

      const response = await axios.post('http://127.0.0.1:4000/category/image', {
        categoryId: categoryId,
        imageURL: imageURL
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        // Add this to see more detailed error information
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        }
      });

      console.log('Category image added:', response.data);
      // You might want to update the UI or state here
      setCategoryImage({ imageURL: imageURL });
    } catch (error) {
      console.error('Error adding category image:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
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

      await axios.delete(`http://127.0.0.1:4000/category/${categoryId}/image`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setCategoryImage(null);
    } catch (error) {
      console.error('Error deleting category image:', error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Sections', link: '/sections' },
    { label: sectionData ? sectionData.category.name : 'Section Details' },
  ];

  return (
    <div className="container mx-auto mt-8">
      <Breadcrumbs items={breadcrumbItems} />
      {sectionData && (
        <Card isFooterBlurred className="w-full max-w-[50%] mx-auto h-[300px] col-span-12 sm:col-span-7 mb-8">
          <CardHeader className="absolute z-10 top-1 flex-col items-start"></CardHeader>
          {categoryImage ? (
            <Image
              removeWrapper
              alt="Category Image"
              className="z-0 w-full h-full object-cover"
              src={categoryImage.imageURL}
            />
          ) : (
            <div className="z-0 w-full h-full flex items-center justify-center bg-gray-200">
              <ImageUploader onImageUploaded={addCategoryImage} bucketName="categoryImages" />
            </div>
          )}
          <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
            <div className="flex flex-col flex-grow">
              <h4 className="text-white font-semibold text-lg mb-1">{sectionData.category.name}</h4>
              <div className="flex flex-col text-white">
                <p className="text-tiny">Category ID: {categoryId}</p>
                <p className="text-tiny">Sort Order: {sectionData.category.sortOrder}</p>
                <p className="text-tiny">Deleted: {sectionData.category.deleted ? "Yes" : "No"}</p>
              </div>
            </div>
            {categoryImage && (
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
      )}
      <div className="flex justify-center items-center" style={{width: '100%', height: '100%'}}>
      <div className="bg-white rounded-lg p-4" style={{width: '95%', height: '100%'}}>
      <h3 className="text-lg font-semibold mt-4 mb-2">Items in this section:</h3>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sectionData.items.map((item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={`${item.id}-${column.accessorKey}`}>
                  {column.accessorKey === 'price'
                    ? `$${(item[column.accessorKey] / 100).toFixed(2)}`
                    : column.accessorKey === 'defaultTaxRates'
                    ? item[column.accessorKey] ? 'Yes' : 'No'
                    : item[column.accessorKey]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
      </div>
    </div>
  );
}