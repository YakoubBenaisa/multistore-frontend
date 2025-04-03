import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { ProductService } from "../services/service";
import { Product } from "../types/types";
import { RootState } from "../../../../redux/store";

export function useGetProducts() {
  const store_id = useSelector((state: RootState) => state.user.user?.storeId) || '';
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    if (!store_id) {
      throw new Error("Store ID not found");
    }

    setLoading(true);
    setError(null);

    try {
      const response = await ProductService.getProducts(store_id);
      console.log("RESPONSE:", response.data);
      // Optionally, you could extract and return response.data if that's what you need.
      return response.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [store_id]);

  return { fetchProducts, loading, error };
}
