
import { api } from '@/lib/api';

export const notificationService = {
    getNotifications: async () => {
        try {
            const response = await api.get('/api/notifications');
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    markAsRead: async (id: string) => {
        try {
            await api.post(`/api/notifications/${id}/read`);
        } catch (error) {
            console.error(`Error marking notification ${id} as read:`, error);
            throw error;
        }
    },

    markAllAsRead: async () => {
        try {
            await api.post('/api/notifications/read-all');
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    },
};
