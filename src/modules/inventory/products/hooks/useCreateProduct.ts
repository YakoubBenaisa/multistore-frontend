import { useState } from 'react';
import api from '../../../../api/api'; // Adjust the path as needed

interface ProductParams {
  store_id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  inventory_count: number;
  images: string[];
}

export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (params: ProductParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/products', params);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createProduct, loading, error };
};
