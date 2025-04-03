import { useState } from 'react';
import api from '../../../../api/api'; // Adjust the path as needed

interface UpdateProductParams {
  store_id?: string;
  name?: string;
  description?: string;
  price?: number;
  category_id?: string;
  inventory_count?: number;
  images?: string[];
}

export const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProduct = async (productId: string, params: UpdateProductParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.request({
        url: `/products/${productId}`,
        method: 'PUT', // PUT for full update
        headers: {
          'Content-Type': 'application/json',
        },
        data: params,
      });
      return { ...response.data, success: true };
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateProduct, loading, error };
};
