import { useState } from 'react';
import { customerService } from '../services/service';

export const useUpdateCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCustomer = async (
    customerId: string,
    data: { name: string; email: string; phone: string; store_id: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await customerService.updateCustomer(customerId, data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCustomer, loading, error };
};
