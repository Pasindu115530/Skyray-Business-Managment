import { db, storage } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Product } from '../types';

export const productService = {
    async getProducts(search?: string): Promise<Product[]> {
        const querySnapshot = await getDocs(collection(db, 'products'));
        let products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        if (search) {
            const lowerSearch = search.toLowerCase();
            products = products.filter(p => 
                p.name?.toLowerCase().includes(lowerSearch) || 
                p.description?.toLowerCase().includes(lowerSearch)
            );
        }
        return products;
    },

    async getProductById(id: string): Promise<Product> {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            throw new Error('Product not found');
        }
        return { id: docSnap.id, ...docSnap.data() } as Product;
    },

    async createProduct(data: any, images: File[], datasheet: File | null): Promise<Product> {
        let imageUrls: string[] = [];
        let datasheetUrl = '';

        for (const file of images) {
            const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            imageUrls.push(await getDownloadURL(snapshot.ref));
        }

        if (datasheet) {
            const storageRef = ref(storage, `datasheets/${Date.now()}_${datasheet.name}`);
            const snapshot = await uploadBytes(storageRef, datasheet);
            datasheetUrl = await getDownloadURL(snapshot.ref);
        }

        const newDoc = {
            ...data,
            images: imageUrls,
            image: imageUrls.length > 0 ? imageUrls[0] : '', // Main image
            datasheetUrl,
            createdAt: new Date().toISOString()
        };

        const docRef = await addDoc(collection(db, 'products'), newDoc);
        return { id: docRef.id, ...newDoc } as Product;
    },

    async updateProduct(id: string, data: any, existingImages: string[], newImages: File[], datasheet: File | null): Promise<void> {
        const docRef = doc(db, 'products', id);
        let updates = { ...data };

        let combinedImages = [...existingImages];

        if (newImages && newImages.length > 0) {
            for (const file of newImages) {
                const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                combinedImages.push(await getDownloadURL(snapshot.ref));
            }
        }
        
        updates.images = combinedImages;
        if (combinedImages.length > 0) {
            updates.image = combinedImages[0];
        } else {
            updates.image = '';
        }

        if (datasheet) {
            const storageRef = ref(storage, `datasheets/${Date.now()}_${datasheet.name}`);
            const snapshot = await uploadBytes(storageRef, datasheet);
            updates.datasheetUrl = await getDownloadURL(snapshot.ref);
        }

        await updateDoc(docRef, updates);
    },

    async deleteProduct(id: string): Promise<void> {
        const docRef = doc(db, 'products', id);
        await deleteDoc(docRef);
    }
};
