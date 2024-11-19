import { useState, useEffect } from 'react';
import axios from 'axios';

export function useCustomers({ currentUser, merchantId }) {
  const [customers, setCustomers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!currentUser || !merchantId) return;

      try {
        setIsLoading(true);
        const response = await axios.get(`/api/v1/customers/${merchantId}`, {
          headers: {
            Authorization: `Bearer ${await currentUser.getIdToken()}`
          }
        });
        setCustomers(response.data);
        setError(null);
      } catch (err) {
        setError(err);
        setCustomers(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [currentUser, merchantId]);

  return { customers, isLoading, error };
}
