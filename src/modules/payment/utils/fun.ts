import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { paymentService } from '../services/paymentService';

export default function usePaymentCommon() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const store_id = useSelector((state: RootState) => state.user.user?.storeId);
  const store = useSelector((state : RootState) => state.store.store);
  
  const execute = useCallback(
    async (SECRET_KEY: string) => {
      if (!store_id) {
        throw new Error('Store ID is not available.');
      }
      setLoading(true);
      setError(null);
      const params = { store_id, SECRET_KEY };
      try {
        let data;

        // if payment method exists then update it
      
        if (!store?.payment_setup_status===true) {
          data = await paymentService.setup(params);
        } else {
          data = await paymentService.update(params);
        }
        setLoading(false);
        return data;
      } catch (err: any) {
        setTimeout(() => {
            setError(null);
          }, 3000);

        setLoading(false);
        throw err;
      }
    },
    [store_id]
  );

  return { execute, loading, error };
}
