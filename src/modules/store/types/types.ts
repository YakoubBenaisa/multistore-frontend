export interface responseType {
    success: boolean,
    data: Store
    }
    
export interface User {
    id: string;
    email: string;
    username: string;
  }
export interface Store {
    id: string;
    name: string;
    description: string;
    owner_id: string;
    meta_integration_status: boolean;
    payment_setup_status: boolean;
    created_at: string;
    updated_at: string;
    owner?: User;
      }
export enum EnumMethod{
  POST = 'POST',
  PUT = 'PUT'
} 


export interface StoreResponse {
  success: boolean;
  data: Store;
}
