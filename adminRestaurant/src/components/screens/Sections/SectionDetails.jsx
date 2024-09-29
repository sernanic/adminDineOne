import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import ImageUploader from '../../shared/imageUploader';
import { Pencil, Trash2 } from 'lucide-react'; // Import the icons

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

  return (
    <div>
      <div className="container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Section Details</h1>
        {sectionData && (
          <div className="flex flex-row gap-8"> {/* Add this wrapper div with flex */}
            <div className="flex-1 info-container">
              <h2 className="text-xl font-semibold mb-2">{sectionData.category.name}</h2>
              <p>Category ID: {categoryId}</p>
              <p>Sort Order: {sectionData.category.sortOrder}</p>
              <p>Deleted: {sectionData.category.deleted ? "Yes" : "No"}</p>
            </div>
            <div className="flex-shrink-0 image-container">
              {categoryImage ? (
                <div className="mb-4 relative">
                  <img src={categoryImage.imageURL} alt="Category" className="max-w-xs" />
                  <div className="absolute top-0 right-0 p-2 flex space-x-2">
                    <button
                      onClick={handleEditImage}
                      className="p-1 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={handleDeleteImage}
                      className="p-1 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <ImageUploader onImageUploaded={addCategoryImage} bucketName="categoryImages" />
              )}
            </div>
          </div>
        )}
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
  );
}