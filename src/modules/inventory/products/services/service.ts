import api from '../../../../api/api'; // Adjust the path as needed
import { ProductResponse } from '../types/types.ts'; // Define this in your types

export class ProductService {
  /**
   * Creates a product.
   * @param params The product parameters.
   * @param ownerId The owner/user id.
   * @returns The JSON response containing the created product data.
   */
  static async create(
    params: {
      store_id: string;
      name: string;
      description: string;
      price: number;
      category_id: string;
      inventory_count: number;
      images: string[];
    },
  ): Promise<ProductResponse> {
    try {
      const response = await api.request({
        url: '/products',
        method: 'POST', // POST for creation
        headers: {
          'Content-Type': 'application/json',
        },
        data: params,
      });
      return response.data as unknown as ProductResponse;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || 'Failed to create product'
      );
    }
  }

  /**
   * Updates a product.
   * @param productId The product id to update.
   * @param params The updated product parameters.
   * @param ownerId The owner/user id.
   * @returns The JSON response containing the updated product data.
   */
  static async update(
    productId: string,
    params: {
      store_id?: string;
      name?: string;
      description?: string;
      price?: number;
      category_id?: string;
      inventory_count?: number;
      images?: string[];
    },
  ): Promise<ProductResponse> {
    try {
      const response = await api.request({
        url: `/products/${productId}`,
        method: 'PUT', // PUT for full update
        headers: {
          'Content-Type': 'application/json',
        },
        data: params,
      });
      return { ...response.data, success: true } as unknown as ProductResponse;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || 'Failed to update product'
      );
    }
  }

  /**
   * Retrieves product details by store id and product id.
   * @param storeId The store id.
   * @param productId The product id.
   * @returns The JSON response containing the product data.
   */
  static async getProduct(
    productId: string
  ): Promise<ProductResponse> {
    try {
      const response = await api.get<ProductResponse>(`/products/${productId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || 'Failed to get product details'
      );
    }
  }

  /**
   * Retrieves all products for a given store.
   * @param storeId The store id.
   * @returns The JSON response containing the list of products.
   */
  static async getProducts(
    storeId: string
  ): Promise<any> {
    try {
      const response = await api.get<any>(`products/stores/${storeId}/products`, {
        headers: {
        },
      });
      return response.data;
    } catch (error: any) {
        console.log('error: ',error)
      throw new Error(
        error.response?.error?.message 
      );
    }
  }

  /**
   * Deletes a product.
   * @param productId The product id to delete.
   * @returns The JSON response after deletion.
   */
  static async delete(
    productId: string
  ): Promise<any> {
    try {
      const response = await api.request({
        url: `/products/${productId}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || 'Failed to delete product'
      );
    }
  }

  /**
   * Updates product inventory.
   * @param productId The product id.
   * @param inventoryCount The new inventory count.
   * @returns The JSON response containing the updated product data.
   */
  static async updateInventory(
    productId: string,
    inventoryCount: number
  ): Promise<ProductResponse> {
    try {
      const response = await api.request({
        url: `/products/${productId}/inventory`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        data: { inventory_count: inventoryCount },
      });
      return response.data as unknown as ProductResponse;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || 'Failed to update inventory'
      );
    }
  }

  /**
   * Uploads images for a product.
   * @param productId The product id.
   * @param images Array of image File objects.
   * @returns The JSON response containing the updated product data with images.
   */
  static async uploadImages(
    productId: string,
    images: File[]
  ): Promise<ProductResponse> {
    try {
      const formData = new FormData();
      images.forEach((image) => {
        formData.append('images', image);
      });
      const response = await api.request({
        url: `/products/${productId}/images`,
        method: 'POST',
        data: formData,
        // Do not set Content-Type header for multipart/form-data;
        // let the browser/axios set the proper boundary.
      });
      return response.data as unknown as ProductResponse;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || 'Failed to upload product images'
      );
    }
  }
}
