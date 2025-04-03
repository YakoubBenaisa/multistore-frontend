import { useState, useCallback } from 'react';
import { MetaIntegrationService, TMetaIntegrationCreate } from '../services/metaIntegration';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

export function useCreateMetaIntegration() {
  const [metaIntegration, setMetaIntegration] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const storeId = useSelector((state: RootState) => state.user.user?.storeId?.toString() || '');

  const createMetaIntegration = useCallback(async (data: TMetaIntegrationCreate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await MetaIntegrationService.createMetaIntegration(storeId, data);
      setMetaIntegration(response);

    } catch (err: any) {
     
        setError(err.message || 'Failed to create meta integration');
      
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  return { metaIntegration, loading, error, createMetaIntegration };
}
