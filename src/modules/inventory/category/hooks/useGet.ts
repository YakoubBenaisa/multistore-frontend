import { useState, useCallback } from 'react';
import { categoryService } from '../services/category'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

export default function useGetCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const storeId = useSelector((state: RootState) => state.user.user?.storeId);
  if (!storeId) return
  
  const getCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getAll(storeId);
      setCategories(data);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  return { categories, getCategories, loading, error };
}
