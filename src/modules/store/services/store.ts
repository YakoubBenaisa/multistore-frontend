import { useDispatch } from "react-redux";
import { EnumMethod, StoreResponse } from "../types/types";
import { setStore } from "../states/storeSlice";

export class StoreService {
  static baseUrl: string = 'http://localhost:3005/api/v1/stores';

  /**
   * Creates or updates a store.
   * @param params The store parameters containing name and description.
   * @param userId The owner/user id.
   * @param method HTTP method: POST for create, PUT for update.
   * @param storeId The store id (empty string if creating).
   */
  private static async createOrUpdate(
    params: { name: string; description: string },
    userId: string,
    method: EnumMethod,
    storeId: string = ''
  ): Promise<StoreResponse> {
    const token = localStorage.getItem('accessToken') || '';
    const response = await fetch(`${this.baseUrl}/${storeId}`, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'owner_id': userId,
      },
      body: JSON.stringify(params)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || `Failed to ${method === EnumMethod.POST ? 'Create' : 'Update'}`
      );
    }

    console.log(data)
    return data;
  }

  static async create(params:{ name: string; description: string }, userId: string, storeId: string = ''): Promise<any> {
  
          return this.createOrUpdate(params, userId, EnumMethod.POST, storeId)
      }

  static async update(params:{ name: string; description: string }, userId: string, storeId: string = ''): Promise<any> {

        return this.createOrUpdate(params, userId, EnumMethod.PUT, storeId)
    }

  /**
   * Retrieves the store data by store id.
   * @param storeId The store id.
   */
  static async getStore(storeId: string): Promise<any> {
    const token = localStorage.getItem('accessToken') || '';
    const response = await fetch(`${this.baseUrl}/${storeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to Get store');
    }
    return data.data;
  }
}
