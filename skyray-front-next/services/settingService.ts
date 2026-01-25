
import { api } from '@/lib/api';

export const settingService = {
    getSettings: async () => {
        try {
            const response = await api.get('/api/settings');
            return response.data;
        } catch (error) {
            console.error('Error fetching settings:', error);
            throw error;
        }
    },

    updateSettings: async (settings: any[]) => {
        try {
            const response = await api.post('/api/settings', { settings });
            return response.data;
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    },
};
