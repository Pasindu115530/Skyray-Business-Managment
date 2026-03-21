import { db, auth } from '@/lib/firebase';
import { storage } from '@/lib/firebase'; // storage එක import කරන්න (lib/firebase.ts එකේ තිබිය යුතුයි)
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface GalleryItem {
    id: string;
    title: string;
    description: string;
    category: string;
    image_path: string; // මෙය Firebase download URL එක වේ
    storage_path: string; // පසුව delete කිරීමට අවශ්‍ය වේ
}

export const galleryService = {
    // 1. පින්තූරයක් Upload කිරීම
    async uploadGalleryImage(file: File, data: any) {
        // පින්තූරය Storage එකට Upload කිරීම
        const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // විස්තර Firestore එකට Save කිරීම (Gallery Table එක මෙන්න)
        return await addDoc(collection(db, "gallery"), {
            title: data.title,
            description: data.description,
            category: data.category,
            image_path: downloadURL,
            storage_path: storageRef.fullPath,
            createdAt: new Date()
        });
    },

    // 2. සියලුම පින්තූර ලබා ගැනීම
    async getGalleryImages(): Promise<GalleryItem[]> {
        const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as GalleryItem[];
    },

    // 3. පින්තූරයක් Delete කිරීම
    async deleteGalleryImage(id: string, storagePath: string) {
        // Storage එකෙන් පින්තූරය අයින් කිරීම
        const fileRef = ref(storage, storagePath);
        await deleteObject(fileRef);
        // Firestore එකෙන් දත්තය අයින් කිරීම
        await deleteDoc(doc(db, "gallery", id));
    },

    // 4. පින්තූරයක් Update කිරීම
    async updateGalleryImage(id: string, data: { title: string; description: string; category: string }, file?: File, oldStoragePath?: string) {
        let updateData: any = {
            title: data.title,
            description: data.description,
            category: data.category,
            updatedAt: new Date()
        };

        if (file) {
            // New image upload
            const storageRef = ref(storage, `gallery/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            
            updateData.image_path = downloadURL;
            updateData.storage_path = storageRef.fullPath;

            // Delete old image if exists
            if (oldStoragePath) {
                try {
                    const oldFileRef = ref(storage, oldStoragePath);
                    await deleteObject(oldFileRef);
                } catch (error) {
                    console.error("Failed to delete old image", error);
                }
            }
        }

        const docRef = doc(db, "gallery", id);
        await updateDoc(docRef, updateData);
    }
};