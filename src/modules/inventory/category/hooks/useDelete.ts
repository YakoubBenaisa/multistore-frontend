import { useState, useCallback } from 'react';
import { categoryService } from '../services/category';

export default function useDeleteCategory() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteCategory = useCallback(async (categoryId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.delete({ categoryId });
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  return { deleteCategory, loading, error };
}
