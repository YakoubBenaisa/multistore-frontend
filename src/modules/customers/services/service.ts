import api from '../../../api/api'; // Adjust the path as needed



export const customerService = {
  createCustomer: (data: { name: string; email: string; phone: string; store_id: string }) =>
    api.post('customers/', data),
  
  updateCustomer: (customerId: string, data: { name: string; email: string; phone: string; store_id: string }) =>
    api.put(`customers/${customerId}`, data),

  getCustomer: (customerId: string) =>
    api.get(`customers/${customerId}`),
  
  getStoreCustomers: (store_id: string, params?: any) =>
    api.get('customers/', { params: { store_id, ...params } }),
  
  deleteCustomer: (customerId: string) =>
    api.delete(`customers/${customerId}`),
};
