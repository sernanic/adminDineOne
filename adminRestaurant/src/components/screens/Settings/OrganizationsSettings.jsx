import React, { useState, useEffect, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useForm } from 'react-hook-form';
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
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const OrganizationsSettings = () => {
  const [merchantData, setMerchantData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        const token = await user.getIdToken();
        
        const response = await axios.get('http://127.0.0.1:4000/merchants', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data)
        setMerchantData(response.data.merchants);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchMerchants();
  }, []);

  const form = useForm({
    defaultValues: {
      merchantId: '',
      name: '',
      address: '',
      city: '',
      state: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const token = await user.getIdToken();
      
      const response = await axios.post('http://127.0.0.1:4000/merchant/add', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Add the new merchant to the list
      setMerchantData(prevData => [...prevData, response.data.merchant]);
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      setError(error.message);
    }
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
        accessorKey: 'address',
      },
      {
        header: 'City',
        accessorKey: 'city',
      },
      {
        header: 'State',
        accessorKey: 'state',
      },
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4">Add Merchant</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Merchant</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="merchantId"
                  rules={{ required: "Merchant ID is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Merchant ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  rules={{ required: "Address is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  rules={{ required: "City is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  rules={{ required: "State is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Add Merchant</Button>
              </form>
            </Form>
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

export default OrganizationsSettings;
