import { useState, useEffect } from 'react';
import axios from 'axios';

export function useCustomerDetails({ currentUser, customerId }) {
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!currentUser || !customerId) return;

      try {
        setIsLoading(true);
        const response = await axios.get(`/api/v1/customers/${customerId}`, {
          headers: {
            Authorization: `Bearer ${await currentUser.getIdToken()}`
          }
        });
        setCustomer(response.data);
        setError(null);
      } catch (err) {
        setError(err);
        setCustomer(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [currentUser, customerId]);

  return { customer, isLoading, error };
}
