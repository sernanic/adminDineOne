import { useState } from 'react';
import { createMerchant, updateMerchant, fetchMerchants } from '../services/merchantService';

export const useMerchantForm = (onSuccess) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);

  const handleAddressSelect = async (selected, setValue) => {
    if (!selected) {
      setValue('address', '');
      setValue('city', '');
      setValue('state', '');
      setValue('country', '');
      setValue('postalCode', '');
      setValue('latitude', '');
      setValue('longitude', '');
      setSelectedLocation(null);
      return;
    }

    try {
      const placeId = selected.value.place_id;
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ placeId }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const place = results[0];
          const addressComponents = place.address_components;
          
          let streetNumber = '';
          let route = '';
          let city = '';
          let state = '';
          let country = '';
          let postalCode = '';
          
          addressComponents.forEach(component => {
            const types = component.types;
            
            if (types.includes('street_number')) {
              streetNumber = component.long_name;
            } else if (types.includes('route')) {
              route = component.long_name;
            } else if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (types.includes('country')) {
              country = component.long_name;
            } else if (types.includes('postal_code')) {
              postalCode = component.long_name;
            }
          });

          const location = {
            streetAddress: selected.label,
            city,
            state,
            country,
            postalCode,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            placeId,
          };

          setSelectedLocation({
            label: selected.label,
            value: selected.value
          });
          
          setValue('address', location.streetAddress);
          setValue('city', location.city);
          setValue('state', location.state);
          setValue('country', location.country);
          setValue('postalCode', location.postalCode);
          setValue('latitude', location.latitude);
          setValue('longitude', location.longitude);
        }
      });
    } catch (error) {
      console.error('Error fetching place details:', error);
      setError(error.message);
    }
  };

  const handleSubmit = async (data, editingMerchant = null) => {
    try {
      const merchantData = {
        merchantId: data.merchantId,
        name: data.name,
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postalCode: data.postalCode,
          coordinates: {
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude)
          }
        }
      };

      if (editingMerchant) {
        await updateMerchant(editingMerchant.merchantId, merchantData);
      } else {
        await createMerchant(merchantData);
      }

      const updatedMerchants = await fetchMerchants();
      onSuccess(updatedMerchants);
      setSelectedLocation(null);
      setError(null);
    } catch (error) {
      console.error('Error saving merchant:', error);
      setError(error.message);
    }
  };

  return {
    selectedLocation,
    error,
    handleAddressSelect,
    handleSubmit,
    setSelectedLocation,
    setError
  };
};
