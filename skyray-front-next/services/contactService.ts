import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export const contactService = {
  async submitMessage(data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<string> {
    const newDoc = {
      ...data,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'contact_messages'), newDoc);
    return docRef.id;
  },

  async getMessages(): Promise<ContactMessage[]> {
    const q = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
  },

  async updateMessageStatus(id: string, status: 'new' | 'read' | 'replied'): Promise<void> {
    const docRef = doc(db, 'contact_messages', id);
    await updateDoc(docRef, { status });
  }
};
