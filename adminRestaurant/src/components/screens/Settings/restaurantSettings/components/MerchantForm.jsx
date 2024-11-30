import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUploader from '@/components/shared/imageUploader';

const MerchantForm = ({ onSubmit, initialData, selectedLocation, onAddressSelect }) => {
  const [imageUrl, setImageUrl] = useState('/placeholder.svg?height=100&width=100');
  const form = useForm({
    defaultValues: {
      merchantId: '',
      name: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      latitude: '',
      longitude: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        merchantId: initialData.merchantId || '',
        name: initialData.name || '',
        address: initialData.location?.address || '',
        city: initialData.location?.city || '',
        state: initialData.location?.state || '',
        country: initialData.location?.country || '',
        postalCode: initialData.location?.postalCode || '',
        latitude: initialData.location?.coordinates?.latitude?.toString() || '',
        longitude: initialData.location?.coordinates?.longitude?.toString() || '',
        imageUrl: initialData.imageUrl || '',
      });
      if (initialData.imageUrl) {
        setImageUrl(initialData.imageUrl);
      }
    }
  }, [initialData, form]);

  const handleImageUpload = (uploadedImageUrl) => {
    setImageUrl(uploadedImageUrl);
    form.setValue('imageUrl', uploadedImageUrl);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          {imageUrl && imageUrl !== '/placeholder.svg?height=100&width=100' ? (
            <img 
              src={imageUrl} 
              alt="Merchant image" 
              className="h-24 w-32 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="h-24 w-32 rounded-lg shadow-md bg-gray-100 flex items-center justify-center text-gray-500 text-xl font-semibold">
              MC
            </div>
          )}
          <ImageUploader onImageUploaded={handleImageUpload} bucketName="merchantImages" />
        </div>
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
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                  selectProps={{
                    value: selectedLocation,
                    onChange: (selected) => onAddressSelect(selected, form.setValue),
                    placeholder: 'Start typing address...',
                    styles: {
                      control: (provided) => ({
                        ...provided,
                        borderRadius: '0.375rem',
                        borderColor: 'rgb(226, 232, 240)',
                      }),
                    },
                    isClearable: true,
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            rules={{ required: "City is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
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
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            rules={{ required: "Postal code is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <input type="hidden" {...form.register('latitude')} />
        <input type="hidden" {...form.register('longitude')} />
        <Button type="submit">
          {initialData ? 'Edit Merchant' : 'Add Merchant'}
        </Button>
      </form>
    </Form>
  );
};

export default MerchantForm;
