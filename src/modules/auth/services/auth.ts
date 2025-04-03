import axios from 'axios';
import api from '../../../api/api';
const BASE_URL = 'http://localhost:3005/api/v1/auth';

// Create an axios instance with default configuration.
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export class AuthService {
  /**
   * Logs in a user.
   * @param credentials An object containing email and password.
   * @returns The JSON response if successful.
   */
  static async loginUser(credentials: { email: string; password: string }): Promise<any> {
    try {
      const response = await axiosInstance.post('/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to login');
    }
  }

  /**
   * Logs out a user.
   * @param token The access token.
   * @returns The JSON response if successful.
   */
  static async logoutUser(): Promise<any> {
    try {
      // The interceptor will automatically add the Authorization header
      const response = await api.post('auth/logout');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to logout');
    }
  }

  /**
   * Registers a new user.
   * @param params An object containing username, email, and password.
   * @returns The JSON response if successful.
   */
  static async registerUser(params: { username: string; email: string; password: string }): Promise<any> {
    try {
      const response = await axiosInstance.post('/auth/register', params);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error?.message || 'Failed to register user');
    }
  }

  /**
   * Refreshes the access token using the refresh token.
   * @returns The JSON response if successful.
   */
  static async refreshToken(): Promise<any> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.removeItem('accessToken')
        return
      }
      const response = await axiosInstance.post('/refresh-token', null, {
        headers: {
          'Authorization': 'Bearer '+ refreshToken,
        },
        
      });
      const data = response.data as { data?: { accessToken?: string } };
      if (data.data?.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        console.log('New access token:', data.data.accessToken);
      }
      return data;
    } catch (error: any) {
      console.error(error.response?.data);
      throw new Error('Failed to refresh token');
    }
  }

   /**
   * Retrieves the user data.
   * @returns The JSON response containing the user data.
   */
   static async getUser(): Promise<any> {
    try {
      // The interceptor automatically attaches the token from localStorage.
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error('Something went wrong in fetching user data');
    }
  }
}
