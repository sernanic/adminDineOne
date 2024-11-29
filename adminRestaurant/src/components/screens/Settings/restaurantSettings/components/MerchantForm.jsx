import React, { useEffect } from 'react';
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

const MerchantForm = ({ onSubmit, initialData, selectedLocation, onAddressSelect }) => {
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
      });
    }
  }, [initialData, form]);

  return (
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
