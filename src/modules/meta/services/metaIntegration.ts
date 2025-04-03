import api from '../../../api/api'; 

// Define types if they are available in your project
export interface TMetaIntegrationCreate {
  app_id: string;
  page_id: string;
  access_token: string;
}

export interface TMetaIntegrationUpdate {
  app_id: string;
  page_id: string;
  access_token?: string;
}

export class MetaIntegrationService {
  /**
   * Creates a meta integration.
   * @param storeId The store id to add in headers.
   * @param data Data required to create a meta integration.
   * @returns API response data.
   */
  static async createMetaIntegration(storeId: string, data: TMetaIntegrationCreate): Promise<any> {
    try {
      const response = await api.post('stores/meta-setup', data, {
        headers: {
          'store-id': storeId,
        },
      });
     
      return response.data;
    } catch (error: any) {
      // Enhance error handling as needed
      if (error.status === 409) {
       
        const response =  await MetaIntegrationService.updateMetaIntegration(storeId, data);
        return response.data
      }
      else{
        throw new Error(error.message);
      }
    }
  }

  /**
   * Updates a meta integration.
   * @param storeId The store id to add in headers.
   * @param data Data required to update the meta integration.
   * @returns API response data.
   */
  static async updateMetaIntegration(storeId: string, data: TMetaIntegrationUpdate): Promise<any> {
    try {
      const response = await api.put('stores/meta-setup', data, {
        headers: {
          'store-id': storeId,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to update meta integration');
    }
  }

  /**
   * Deletes a meta integration.
   * @param storeId The store id for which to delete the meta integration. Also passed in headers.
   * @returns API response data.
   */
  static async deleteMetaIntegration(storeId: string): Promise<any> {
    try {
      const response = await api.delete(`/meta-integration/${storeId}`, {
        headers: {
          'store-id': storeId,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error('Failed to delete meta integration');
    }
  }
}
