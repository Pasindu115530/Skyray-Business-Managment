import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const settingService = {
    getSettings: async () => {
        try {
            const docRef = doc(db, 'settings', 'global');
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? docSnap.data().settings || [] : [];
        } catch (error) {
            console.error('Error fetching settings:', error);
            throw error;
        }
    },

    updateSettings: async (settings: any[]) => {
        try {
            const docRef = doc(db, 'settings', 'global');
            await setDoc(docRef, { settings }, { merge: true });
            return { message: 'Settings updated successfully' };
        } catch (error) {
            console.error('Error updating settings:', error);
            throw error;
        }
    },
};
