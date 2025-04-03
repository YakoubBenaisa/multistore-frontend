import { useState, useCallback } from 'react';
import { MetaIntegrationService } from '../services/metaIntegration';

export function useDeleteMetaIntegration(storeId: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMetaIntegration = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await MetaIntegrationService.deleteMetaIntegration(storeId);
    } catch (err: any) {
      setError(err.message || 'Failed to delete meta integration');
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  return { loading, error, deleteMetaIntegration };
}
