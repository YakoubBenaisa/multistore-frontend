import { useState } from 'react';
import { customerService } from '../services/service';

export const useCreateCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomer = async (data: { name: string; email: string; phone: string; store_id: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.createCustomer(data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCustomer, loading, error };
};
