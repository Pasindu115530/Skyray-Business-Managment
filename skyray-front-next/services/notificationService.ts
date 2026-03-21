import { db } from '@/lib/firebase';
import { collection, doc, getDocs, updateDoc, writeBatch } from 'firebase/firestore';

export const notificationService = {
    getNotifications: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'notifications'));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    markAsRead: async (id: string) => {
        try {
            const docRef = doc(db, 'notifications', id);
            await updateDoc(docRef, { read: true });
        } catch (error) {
            console.error(`Error marking notification ${id} as read:`, error);
            throw error;
        }
    },

    markAllAsRead: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'notifications'));
            const batch = writeBatch(db);
            
            querySnapshot.docs.forEach((document) => {
                if (!document.data().read) {
                    batch.update(document.ref, { read: true });
                }
            });
            
            await batch.commit();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            throw error;
        }
    },
};
