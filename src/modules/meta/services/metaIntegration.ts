
export class paymentService {
  static baseUrl: string = 'http://localhost:3005/api/v1/stores/';

  /**
   * Creates or updates a store.
   * @param params The meta account parameters containing  and description.
   * @param userId The owner/user id.
   * @param method HTTP method: POST for create, PUT for update.
   * @param storeId The store id (empty string if creating).
   */
  static async setup(
    params: { SECRET_KEY: string; store_id: string },
  
  ): Promise<any> {
    const token = localStorage.getItem('accessToken') || '';
    const response = await fetch(`${this.baseUrl}/mata-integration`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify(params)
    });

   

    if (!response.ok) {
      throw new Error(
        "Failed to add you"
      );
    }
  
  }

}