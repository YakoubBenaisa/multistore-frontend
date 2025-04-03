

export class categoryService {
  static baseUrl: string = 'http://localhost:3005/api/v1/stores';

  /**
   * Creates or updates a store.
   * @param params The store parameters containing only name.
   * @param storeId The store id (empty string if creating).
   */
  static async create(
    params: { name: string, storeId: string| undefined},
    
  ): Promise<any> {
    const token = localStorage.getItem('accessToken') || '';
    const response = await fetch(`${this.baseUrl}/categories/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(params)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || `Failed to create ${params.name} category`
      );
    }
    return data;
  }

  /**
   * Retrieves the categories data by store id.
   * @param storeId The store id.
   */
  static async getAll(storeId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/${storeId}/categories`, {method: 'GET'});

    const data = await response.json();
    console.log("service: ",data.data )
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to Get categories');
    }
    return data.data;
  }

  /**
   * Creates or updates a store.
   * @param params The store parameters containing only name.
   * @param storeId The store id (empty string if creating).
   */
  static async delete(params: {categoryId: string}): Promise<any> {

    const token = localStorage.getItem('accessToken') || '';
    const response = await fetch(`${this.baseUrl}/categories/${params.categoryId}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    //const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Failed to deltet category with ${params.categoryId} Id`
      );
    }
    //return data;
  }

}
