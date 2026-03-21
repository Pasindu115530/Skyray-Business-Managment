import { db, storage } from '@/lib/firebase';
import { 
  collection, addDoc, getDocs, doc, deleteDoc, 
  query, orderBy, where, serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const productService = {
  // 1. නිෂ්පාදන ලබා ගැනීම (සෙවුම් පහසුකම සහිතව)
  async getProducts(searchQuery: string = '') {
    const q = query(collection(db, "products"), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    
    let products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // සරල Client-side සෙවුමක් (Firestore හි සංකීර්ණ සෙවුම් වෙනුවට)
    if (searchQuery) {
      const lowQuery = searchQuery.toLowerCase();
      products = products.filter((p: any) => 
        p.name?.toLowerCase().includes(lowQuery) || 
        p.sku?.toLowerCase().includes(lowQuery) ||
        p.category?.toLowerCase().includes(lowQuery)
      );
    }
    return products;
  },

  // 2. අලුත් නිෂ්පාදනයක් නිර්මාණය කිරීම
  async createProduct(formData: any, imageFiles: File[], datasheetFile: File | null) {
    const imageUrls: string[] = [];
    let datasheetUrl = null;

    // පින්තූර කිහිපයක් තිබේ නම් ඒවා එකින් එක Upload කිරීම
    for (const file of imageFiles) {
      const imgRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      imageUrls.push(url);
    }

    // Datasheet (PDF) එක Upload කිරීම
    if (datasheetFile) {
      const pdfRef = ref(storage, `datasheets/${Date.now()}_${datasheetFile.name}`);
      await uploadBytes(pdfRef, datasheetFile);
      datasheetUrl = await getDownloadURL(pdfRef);
    }

    // Firestore එකට දත්ත ඇතුළත් කිරීම
    return await addDoc(collection(db, "products"), {
      ...formData,
      images: imageUrls, // පින්තූර ලැයිස්තුව
      image: imageUrls.length > 0 ? imageUrls[0] : null, // ප්‍රධාන පින්තූරය
      datasheet_path: datasheetUrl,
      createdAt: serverTimestamp()
    });
  },

  // 3. නිෂ්පාදනයක් මැකීම
  async deleteProduct(id: string) {
    await deleteDoc(doc(db, "products", id));
  }
};