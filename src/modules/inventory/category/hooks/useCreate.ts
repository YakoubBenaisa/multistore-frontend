import { useState, useCallback } from 'react';
import { categoryService } from '../services/category';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

export default function useCreateCategory() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const storeId = useSelector((state: RootState) => state.user.user?.storeId);
  if (!storeId) return

  const createCategory = useCallback(async (name: string) => {
    
    const params = {name, storeId}
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.create(params);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  return { createCategory, loading, error };
}
