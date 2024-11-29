import React, { useState, useEffect, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchMerchants, deleteMerchant, fetchMerchantById } from './services/merchantService';
import { useMerchantForm } from './hooks/useMerchantForm';
import MerchantForm from './components/MerchantForm';

const RestaurantsSettings = () => {
  const [merchantData, setMerchantData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState(null);

  const {
    selectedLocation,
    handleAddressSelect,
    handleSubmit,
    setSelectedLocation,
  } = useMerchantForm((updatedMerchants) => {
    setMerchantData(updatedMerchants);
    setIsDialogOpen(false);
    setEditingMerchant(null);
  });

  useEffect(() => {
    const loadMerchants = async () => {
      try {
        const merchants = await fetchMerchants();
        setMerchantData(merchants);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    loadMerchants();
  }, []);

  const handleEdit = async (merchant) => {
    try {
      const merchantDetails = await fetchMerchantById(merchant.merchantId);
      
      if (merchantDetails.location?.address) {
        const locationValue = {
          label: merchantDetails.location.address,
          value: {
            description: merchantDetails.location.address,
            place_id: merchantDetails.location.placeId || '',
          }
        };
        setSelectedLocation(locationValue);
      }

      setEditingMerchant(merchantDetails);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching merchant details:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (merchantId) => {
    try {
      await deleteMerchant(merchantId);
      const merchants = await fetchMerchants();
      setMerchantData(merchants);
    } catch (error) {
      console.error('Error deleting merchant:', error);
      setError(error.message);
    }
  };

  const handleDialogChange = (open) => {
    if (!open) {
      setEditingMerchant(null);
      setSelectedLocation(null);
    }
    setIsDialogOpen(open);
  };

  const columns = useMemo(
    () => [
      {
        header: 'Merchant ID',
        accessorKey: 'merchantId',
      },
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Address',
        accessorKey: 'location.address',
      },
      {
        header: 'City',
        accessorKey: 'location.city',
      },
      {
        header: 'State',
        accessorKey: 'location.state',
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(row.original.merchantId)}
            >
              Delete
            </Button>
          </div>
        ),
      }
    ],
    []
  );

  const table = useReactTable({
    data: merchantData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Merchant List</CardTitle>
        <CardDescription>Overview of all registered merchants</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="mb-4">Add Merchant</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMerchant ? 'Edit Merchant' : 'Add New Merchant'}</DialogTitle>
            </DialogHeader>
            <MerchantForm
              onSubmit={(data) => handleSubmit(data, editingMerchant)}
              initialData={editingMerchant}
              selectedLocation={selectedLocation}
              onAddressSelect={handleAddressSelect}
            />
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {merchantData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No merchant data available.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RestaurantsSettings;
