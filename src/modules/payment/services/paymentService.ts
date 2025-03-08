import { EnumMethod } from "../types/types";

export class paymentService {
    static baseUrl: string = 'http://localhost:3005/api/v1/stores';
  
    /**
     * Creates a new payment setup.
     * @param params Object containing the SECRET_KEY and store_id.
     * @returns The created payment setup data.
     */
    private static async setup_or_update(params: { SECRET_KEY: string; store_id: string }, method: EnumMethod): Promise<any> {
      const token = localStorage.getItem('accessToken') || '';
      const response = await fetch(`${paymentService.baseUrl}/payments/chargili`, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to create payment setup");
      }
      return data.data;
    }

    static async setup(params: { SECRET_KEY: string; store_id: string }): Promise<any> {

        return this.setup_or_update(params, EnumMethod.POST)
    }

    static async update(params: { SECRET_KEY: string; store_id: string }): Promise<any> {

        return this.setup_or_update(params, EnumMethod.PATCH)
    }

}