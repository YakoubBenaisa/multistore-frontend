import api from '../../../api/api'; // Adjust the path as needed
import {  StoreResponse } from "../types/types";

export class StoreService {
  /**
   * Creates a store.
   * @param params The store parameters containing name and description.
   * @param userId The owner/user id.
   * @param storeId Optional store id (if needed for creation, usually not provided).
   * @returns The JSON response containing the store data.
   */
  static async create(
    params: { name: string; description: string },
    userId: string,
    storeId: string = ''
  ): Promise<StoreResponse> {
    let uri = '/stores';
    if (storeId) {
      uri = `/stores/${storeId}`;
    }
    try {
      const response = await api.request({
        url: uri,
        method: 'POST', // POST for creation
        headers: {
          'Content-Type': 'application/json',
          'owner_id': userId,
        },
        data: params,
      });
      return response.data as any;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || 'Failed to Create store'
      );
    }
  }

  /**
   * Updates a store.
   * @param params The store parameters containing name and description.
   * @param userId The owner/user id.
   * @param storeId The store id to update.
   * @returns The JSON response containing the updated store data.
   */
  static async update(
    params: { name: string; description: string },
    userId: string,
    storeId: string
  ): Promise<StoreResponse> {
    const uri = `/stores/${storeId}`;
    try {
      const response = await api.request({
        url: uri,
        method: 'PUT', // PUT for updating
        headers: {
          'Content-Type': 'application/json',
          'owner_id': userId,
        },
        data: params,
      });
      return response.data as any;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || 'Failed to Update store'
      );
    }
  }

  /**
   * Retrieves the store data by store id.
   * @param storeId The store id.
   * @returns The store data.
   */
  static async getStore(
    storeId: string
  ): Promise<StoreResponse> {
    try {
      const response = await api.get<StoreResponse>(`/stores/${storeId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error?.message || 'Failed to Get store'
      );
    }
  }
}