const BASE_URL = 'http://localhost:3005/api/v1/auth';

export class AuthService {
  /**
   * Logs in a user.
   * @param credentials An object containing email and password.
   * @returns The JSON response if successful.
   */
  static async loginUser(credentials: { email: string; password: string }): Promise<any> {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to login');
    }

    return data;
  }

  /**
   * Logs out a user.
   * @param token The access token.
   * @returns The JSON response if successful.
   */
  static async logoutUser(token: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to logout');
    }

    return data;
  }

  /**
   * Registers a new user.
   * @param params An object containing username, email, and password.
   * @returns The JSON response if successful.
   */
  static async registerUser(params: { username: string; email: string; password: string }): Promise<any> {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message);
    }

    return data;
  }

  /**
   * Refreshes the access token using the refresh token.
   * @returns The JSON response if successful.
   */
  static async refreshToken(): Promise<any> {
    const response = await fetch(`${BASE_URL}/refresh-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`,
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      throw new Error('Failed to refresh token');
    }

    localStorage.setItem('accessToken', data.data.accessToken);
    console.log(data.data.accessToken);
    return data;
  }

  /**
   * Retrieves the user data.
   * @param token The access token.
   * @returns The JSON response containing the user data.
   */
  static async getUser(token: string | null): Promise<any> {
    const response = await fetch(`${BASE_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error('Something went wrong in fetching user data');
    }

    return await response.json();
  }
}
