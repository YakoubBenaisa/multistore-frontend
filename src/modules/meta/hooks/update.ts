import { useState, useCallback } from 'react';
import { MetaIntegrationService, TMetaIntegrationUpdate } from '../services/metaIntegration';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

export function useUpdateMetaIntegration() {
  const [metaIntegration, setMetaIntegration] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const storeId = useSelector((state: RootState) => state.user.user?.storeId?.toString() || '');

  const updateMetaIntegration = useCallback(async (data: TMetaIntegrationUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await MetaIntegrationService.updateMetaIntegration(storeId, data);
      setMetaIntegration(response);
    } catch (err: any) {
      setError(err.message || 'Failed to update meta integration');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  return { metaIntegration, loading, error, updateMetaIntegration };
}
