import { EnumMethod } from "../types/types";

export class paymentService {
  static baseUrl: string = 'http://localhost:3005/api/v1/stores';

  /**
   * Creates or updates a payment setup.
   * @param params Object containing the SECRET_KEY and store_id.
   * @param method HTTP method to use (POST for setup, PATCH for update).
   * @returns The created or updated payment setup data.
   */
  private static async setup_or_update(
    params: { SECRET_KEY: string; store_id: string },
    method: EnumMethod
  ): Promise<any> {
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
      // If a conflict error occurs during setup (POST), attempt to update instead.
      if (response.status === 409 && method === EnumMethod.POST) {
        return paymentService.update(params);
      }
      throw new Error(data.error?.message || "Failed to create/update payment setup");
    }
    return data.data;
  }

  /**
   * Sets up a new payment configuration.
   * @param params Object containing the SECRET_KEY and store_id.
   * @returns The created payment setup data.
   */
  static async setup(params: { SECRET_KEY: string; store_id: string }): Promise<any> {
    return this.setup_or_update(params, EnumMethod.POST);
  }

  /**
   * Updates an existing payment configuration.
   * @param params Object containing the SECRET_KEY and store_id.
   * @returns The updated payment setup data.
   */
  static async update(params: { SECRET_KEY: string; store_id: string }): Promise<any> {
    return this.setup_or_update(params, EnumMethod.PATCH);
  }
}
