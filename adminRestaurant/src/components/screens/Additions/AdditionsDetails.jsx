import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Breadcrumbs from "@/components/shared/Breadcrumbs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const AdditionsDetails = () => {
  const { merchantId, modifierGroupId } = useParams();
  const [modifiers, setModifiers] = useState([]);
  const [modifierGroupName, setModifierGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModifiers = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:4000/modifiers/${merchantId}/modifierGroup/${modifierGroupId}`);
        setModifiers(response.data.modifiers);
        setModifierGroupName(response.data.modifierGroupName || 'Addition Details');
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching modifiers:", error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchModifiers();
  }, [merchantId, modifierGroupId]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Additions', link: '/additions' },
    { label: modifierGroupName },
  ];

  return (
    <div className="container mx-auto mt-8">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="additionsDetails mt-4">
        <h3 className="text-xl font-semibold mb-2">Modifiers</h3>
        <Table>
          <TableCaption>Modifiers for this addition</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Modified Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modifiers.map((modifier) => (
              <TableRow key={modifier.modifierId}>
                <TableCell>{modifier.name}</TableCell>
                <TableCell>${modifier.price.toFixed(2)}</TableCell>
                <TableCell>{modifier.available ? 'Yes' : 'No'}</TableCell>
                <TableCell>{new Date(modifier.modifiedTime).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdditionsDetails;
