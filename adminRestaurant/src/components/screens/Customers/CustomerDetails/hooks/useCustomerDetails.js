import { useState, useEffect } from 'react';
import axios from 'axios';

export function useCustomerDetails({ currentUser, customerId }) {
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!currentUser || !customerId) return;

      try {
        setIsLoading(true);
        const response = await axios.get(`http://127.0.0.1:4000/api/v1/customers/${customerId}`, {
          headers: {
            Authorization: `Bearer ${await currentUser.getIdToken()}`
          }
        });
        setCustomer(response.data);
      } catch (err) {
        setError(err);
        console.error('Error fetching customer details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [currentUser, customerId]);

  return { customer, isLoading, error };
}
