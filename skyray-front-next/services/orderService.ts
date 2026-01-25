
import { api } from '@/lib/api';

export const orderService = {
    getOrders: async () => {
        try {
            const response = await api.get('/api/orders');
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    getOrder: async (id: number) => {
        try {
            const response = await api.get(`/api/orders/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching order ${id}:`, error);
            throw error;
        }
    },

    updateOrder: async (id: number, data: any) => {
        try {
            const response = await api.put(`/api/orders/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating order ${id}:`, error);
            throw error;
        }
    },

    deleteOrder: async (id: number) => {
        try {
            const response = await api.delete(`/api/orders/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting order ${id}:`, error);
            throw error;
        }
    },
};
