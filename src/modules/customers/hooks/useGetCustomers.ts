import { useState, useEffect } from 'react';
import { customerService } from '../services/service';

export const useGetCustomers = (store_id: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.getStoreCustomers(store_id);
      //console.log(response.data.data.customers)
      return response.data.data.customers 
      
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch customers');
    } finally {
      
      setLoading(false);
      
    }
  };

  return { fetchCustomers, loading, error, refetch: fetchCustomers };
};
