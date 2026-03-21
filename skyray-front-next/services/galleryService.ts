import { db, storage } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface GalleryItem {
    id: string;
    title: string;
    description: string;
    image_path: string;
    category?: string;
    created_at?: string;
}

export const galleryService = {
    async getGalleryImages(): Promise<GalleryItem[]> {
        const querySnapshot = await getDocs(collection(db, 'gallery'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
    },

    async uploadGalleryImage(formData: FormData): Promise<GalleryItem> {
        const file = formData.get('image') as File;
        const title = formData.get('title') as string || '';
        const description = formData.get('description') as string || '';
        const category = formData.get('category') as string || '';

        let image_path = '';
        if (file) {
            const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            image_path = await getDownloadURL(snapshot.ref);
        }

        const newDoc = {
            title,
            description,
            category,
            image_path,
            created_at: new Date().toISOString()
        };
        const docRef = await addDoc(collection(db, 'gallery'), newDoc);
        return { id: docRef.id, ...newDoc } as GalleryItem;
    },

    async updateGalleryImage(id: string, formData: FormData): Promise<GalleryItem> {
        const file = formData.get('image') as File | null;
        const title = formData.get('title') as string || '';
        const description = formData.get('description') as string || '';
        const category = formData.get('category') as string || '';

        const updateData: any = { title, description, category };

        if (file && file.size > 0) {
            const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            updateData.image_path = await getDownloadURL(snapshot.ref);
        }

        const docRef = doc(db, 'gallery', id);
        await updateDoc(docRef, updateData);
        
        const docSnap = await getDoc(docRef);
        return { id, ...docSnap.data() } as GalleryItem;
    },

    async deleteGalleryImage(id: string): Promise<void> {
        const docRef = doc(db, 'gallery', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.image_path && data.image_path.includes('firebasestorage')) {
                try {
                    const imageRef = ref(storage, data.image_path);
                    await deleteObject(imageRef);
                } catch (e) {
                    console.error("Could not delete image from storage", e);
                }
            }
            await deleteDoc(docRef);
        }
    }
};
