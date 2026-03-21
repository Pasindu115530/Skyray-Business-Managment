import { db, storage } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Quotation } from '../types/quotation';

export type { Quotation };

export const quotationService = {
    async getQuotations(): Promise<Quotation[]> {
        const querySnapshot = await getDocs(collection(db, 'quotations'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    },

    async getQuotationById(id: string): Promise<Quotation> {
        const docRef = doc(db, 'quotations', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) throw new Error('Quotation not found');
        return { id: docSnap.id, ...docSnap.data() } as any;
    },

    async updateQuotation(id: string, data: Partial<Quotation>): Promise<Quotation> {
        const docRef = doc(db, 'quotations', id);
        await updateDoc(docRef, data);
        const docSnap = await getDoc(docRef);
        return { id: docSnap.id, ...docSnap.data() } as any;
    },

    async getQuotationRequests(page: number = 1, status?: string): Promise<any> {
        let q = collection(db, 'quotation_requests') as any;
        if (status) {
            q = query(q, where('status', '==', status));
        }
        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map(doc => {
            const data = doc.data() as any;
            return {
                id: doc.id,
                ...data,
                customer_name: data.name,
                customer_email: data.email,
                customer_phone: data.phone,
                item_details: data.items,
                created_at: data.createdAt || new Date().toISOString()
            };
        });
        return {
            data: requests,
            current_page: 1, // basic mock for pagination
            last_page: 1
        };
    },

    async rejectRequest(id: string): Promise<any> {
        const docRef = doc(db, 'quotation_requests', id);
        await updateDoc(docRef, { status: 'rejected', repliedAt: new Date().toISOString() });
        return { message: 'Quotation request rejected' };
    },

    async createQuotationRequest(data: { name: string, email: string, phone: string, message: string, items: { product_id: string, quantity: number }[] }): Promise<any> {
        const newDoc = { ...data, status: 'pending', createdAt: new Date().toISOString() };
        const docRef = await addDoc(collection(db, 'quotation_requests'), newDoc);
        return { message: 'Quotation request submitted', id: docRef.id };
    },

    async replyToRequest(id: string, data: { items?: any[], message: string, mode?: 'create' | 'upload', file?: File }): Promise<any> {
        const docRef = doc(db, 'quotation_requests', id);
        let fileUrl = '';

        if (data.mode === 'upload' && data.file) {
            const storageRef = ref(storage, `quotations/${Date.now()}_${data.file.name}`);
            const snapshot = await uploadBytes(storageRef, data.file);
            fileUrl = await getDownloadURL(snapshot.ref);
        }

        const replyData = {
            status: 'quoted',
            replyMessage: data.message,
            fileUrl,
            items: data.items || [],
            repliedAt: new Date().toISOString()
        };

        await updateDoc(docRef, replyData);
        return { message: 'Reply sent successfully', ...replyData };
    },

    async sendDirectQuote(data: { name: string, email: string, phone: string, items?: any[], message: string, mode?: 'create' | 'upload', file?: File }): Promise<any> {
        let fileUrl = '';

        if (data.mode === 'upload' && data.file) {
            const storageRef = ref(storage, `quotations/${Date.now()}_${data.file.name}`);
            const snapshot = await uploadBytes(storageRef, data.file);
            fileUrl = await getDownloadURL(snapshot.ref);
        }

        const newDoc = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
            items: data.items || [],
            fileUrl,
            status: 'quoted',
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'quotations'), newDoc);
        return { message: 'Direct quote sent', id: docRef.id };
    }
};
