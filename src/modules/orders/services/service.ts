import api from '../../../api/api'; // Adjust the path as needed



const main_route = 'orders';

export const orderService = {
  createOrder: (data: { name: string; email: string; phone: string; store_id: string }) =>
    api.post(`${main_route}/`, data),
  
  updateOrder: (orderId: string, data: { name: string; email: string; phone: string; store_id: string }) =>
    api.put(`${main_route}/${orderId}`, data),

  getOrder: (orderId: string) =>
    api.get(`${main_route}/${orderId}`),
  
  getStoreOrders: (store_id: string, params?: any) =>
    api.get(`${main_route}/`, { params: { store_id, ...params } }),
  
  deleteOrder: (orderId: string) =>
    api.delete(`${main_route}/${orderId}`),

  updateOrderStatus: (orderId: string, data: { name: string; email: string; phone: string; store_id: string }) =>
    api.patch(`${main_route}/${orderId}/status`, data),
};
