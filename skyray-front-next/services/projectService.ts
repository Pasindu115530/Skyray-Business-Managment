import { db, storage } from '@/lib/firebase';
import { 
  collection, addDoc, getDocs, doc, deleteDoc, updateDoc,
  query, orderBy, serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const projectService = {
  // 1. සියලුම ප්‍රොජෙක්ට් ලබා ගැනීම
  async getProjects() {
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // 2. අලුත් ප්‍රොජෙක්ට් එකක් නිර්මාණය කිරීම
  async createProject(formData: any, thumbnailFile: File | null, galleryFiles: File[]) {
    let thumbnailUrl = null;
    const galleryUrls: string[] = [];

    // Thumbnail එක Upload කිරීම
    if (thumbnailFile) {
      const thumbRef = ref(storage, `projects/thumbnails/${Date.now()}_${thumbnailFile.name}`);
      await uploadBytes(thumbRef, thumbnailFile);
      thumbnailUrl = await getDownloadURL(thumbRef);
    }

    // Gallery පින්තූර එකින් එක Upload කිරීම
    for (const file of galleryFiles) {
      const fileRef = ref(storage, `projects/gallery/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      galleryUrls.push(url);
    }

    // Firestore එකට දත්ත ඇතුළත් කිරීම
    return await addDoc(collection(db, "projects"), {
      ...formData,
      thumbnail_path: thumbnailUrl,
      project_image_urls: galleryUrls,
      createdAt: serverTimestamp()
    });
  },

  // 3. ප්‍රොජෙක්ට් එකක් යාවත්කාලීන කිරීම (Update)
  async updateProject(
    id: string, 
    formData: any, 
    thumbnailFile: File | null, 
    existingGalleryImages: string[], 
    newGalleryImages: File[]
  ) {
    let thumbnailUrl = null;
    const newGalleryUrls: string[] = [];

    // නව Thumbnail එකක් තිබේ නම් Upload කිරීම
    if (thumbnailFile) {
      const thumbRef = ref(storage, `projects/thumbnails/${Date.now()}_${thumbnailFile.name}`);
      await uploadBytes(thumbRef, thumbnailFile);
      thumbnailUrl = await getDownloadURL(thumbRef);
    }

    // නව Gallery පින්තූර එකින් එක Upload කිරීම
    for (const file of newGalleryImages) {
      const fileRef = ref(storage, `projects/gallery/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      newGalleryUrls.push(url);
    }

    const updatedGallery = [...existingGalleryImages, ...newGalleryUrls];

    const projectRef = doc(db, "projects", id);
    const updateData: any = {
      ...formData,
      project_image_urls: updatedGallery,
      updatedAt: serverTimestamp()
    };

    if (thumbnailUrl) {
      updateData.thumbnail_path = thumbnailUrl;
    }

    await updateDoc(projectRef, updateData);
  },

  // 3. ප්‍රොජෙක්ට් එකක් මැකීම
  async deleteProject(id: string) {
    await deleteDoc(doc(db, "projects", id));
  }
};