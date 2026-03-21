import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

export const orderService = {
    getOrders: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'orders'));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    getOrder: async (id: string) => {
        try {
            const docRef = doc(db, 'orders', id);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                throw new Error('Order not found');
            }
            return { id: docSnap.id, ...docSnap.data() };
        } catch (error) {
            console.error(`Error fetching order ${id}:`, error);
            throw error;
        }
    },

    updateOrder: async (id: string, data: any) => {
        try {
            const docRef = doc(db, 'orders', id);
            await updateDoc(docRef, data);
            return { id, message: 'Order updated successfully' };
        } catch (error) {
            console.error(`Error updating order ${id}:`, error);
            throw error;
        }
    },

    deleteOrder: async (id: string) => {
        try {
            const docRef = doc(db, 'orders', id);
            await deleteDoc(docRef);
            return { message: 'Order deleted successfully' };
        } catch (error) {
            console.error(`Error deleting order ${id}:`, error);
            throw error;
        }
    },
};
