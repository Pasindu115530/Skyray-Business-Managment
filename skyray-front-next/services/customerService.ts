import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export const customerService = {
    getCustomers: async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'customers'));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    },

    createCustomer: async (data: any) => {
        try {
            const docRef = await addDoc(collection(db, 'customers'), data);
            return { id: docRef.id, ...data };
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    },

    updateCustomer: async (id: string, data: any) => {
        try {
            const docRef = doc(db, 'customers', id);
            await updateDoc(docRef, data);
            return { id, message: 'Customer updated successfully' };
        } catch (error) {
            console.error(`Error updating customer ${id}:`, error);
            throw error;
        }
    },

    deleteCustomer: async (id: string) => {
        try {
            const docRef = doc(db, 'customers', id);
            await deleteDoc(docRef);
            return { message: 'Customer deleted successfully' };
        } catch (error) {
            console.error(`Error deleting customer ${id}:`, error);
            throw error;
        }
    },
};
