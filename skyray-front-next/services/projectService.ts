import { db, storage } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Project } from '../types';

export const projectService = {
    async getProjects(): Promise<Project[]> {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    },

    async getProjectById(id: string): Promise<Project> {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            throw new Error('Project not found');
        }
        return { id: docSnap.id, ...docSnap.data() } as Project;
    },

    async getProjectsByClient(clientName: string): Promise<Project[]> {
        const q = query(collection(db, 'projects'), where('client', '==', clientName));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    },

    async createProject(data: any, thumbnail: File | null, galleryImages: File[]): Promise<Project> {
        let thumbnail_path = '';
        let gallery_paths: string[] = [];

        if (thumbnail) {
            const storageRef = ref(storage, `projects/${Date.now()}_${thumbnail.name}`);
            const snapshot = await uploadBytes(storageRef, thumbnail);
            thumbnail_path = await getDownloadURL(snapshot.ref);
        }

        for (const file of galleryImages) {
            const storageRef = ref(storage, `projects/gallery/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            gallery_paths.push(await getDownloadURL(snapshot.ref));
        }

        const newDoc = {
            ...data,
            thumbnail_path,
            gallery_paths,
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'projects'), newDoc);
        return { id: docRef.id, ...newDoc } as Project;
    },

    async updateProject(id: string, data: any, thumbnail: File | null, existingGalleryImages: string[], newGalleryImages: File[]): Promise<void> {
        const docRef = doc(db, 'projects', id);
        let updates = { ...data };

        if (thumbnail) {
            const storageRef = ref(storage, `projects/${Date.now()}_${thumbnail.name}`);
            const snapshot = await uploadBytes(storageRef, thumbnail);
            updates.thumbnail_path = await getDownloadURL(snapshot.ref);
        }

        let combinedGallery = [...existingGalleryImages];

        if (newGalleryImages && newGalleryImages.length > 0) {
            for (const file of newGalleryImages) {
                const storageRef = ref(storage, `projects/gallery/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                combinedGallery.push(await getDownloadURL(snapshot.ref));
            }
        }
        
        updates.gallery_paths = combinedGallery;
        // Also keep project_image_urls in sync if it's used
        updates.project_image_urls = combinedGallery;

        await updateDoc(docRef, updates);
    },

    async deleteProject(id: string): Promise<void> {
        const docRef = doc(db, 'projects', id);
        await deleteDoc(docRef);
    }
};
