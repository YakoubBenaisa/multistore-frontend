import { useCallback } from 'react';
import { orderService } from '../services/service';

export const useGetStoreOrders = (storeId: string) => {
  const fetchStoreOrders = useCallback(async () => {
    if (!storeId) return null;
    try {
      const response = await orderService.getStoreOrders(storeId);
      // Assuming the API response structure:
      // response.data.data.orders is the orders array.
      return response.data.data.orders;
    } catch (error) {
      console.error("Error fetching store orders:", error);
      return null;
    }
  }, [storeId]);

  return { fetchStoreOrders };
};
