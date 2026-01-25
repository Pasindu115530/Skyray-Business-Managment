
import { api } from '@/lib/api';

export const customerService = {
    getCustomers: async () => {
        try {
            const response = await api.get('/api/customers');
            return response.data;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    },

    createCustomer: async (data: any) => {
        try {
            const response = await api.post('/api/customers', data);
            return response.data;
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    },

    updateCustomer: async (id: number, data: any) => {
        try {
            const response = await api.put(`/api/customers/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating customer ${id}:`, error);
            throw error;
        }
    },

    deleteCustomer: async (id: number) => {
        try {
            const response = await api.delete(`/api/customers/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting customer ${id}:`, error);
            throw error;
        }
    },
};
