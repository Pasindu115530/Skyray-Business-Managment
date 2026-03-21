import { db, storage } from '@/lib/firebase';
import { 
  collection, getDocs, doc, updateDoc, deleteDoc, 
  query, orderBy, getDoc, addDoc, serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Quotation {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    message?: string;
    status: 'pending' | 'replied' | 'rejected';
    item_details: Array<{ name: string; quantity: number }>;
    created_at: any;
}

export const quotationService = {
    // 1. සියලුම Quotation Requests ලබා ගැනීම
    async getQuotationRequests() {
        const q = query(collection(db, "quotations"), orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => {
            const d = doc.data();
            return {
                id: doc.id,
                customer_name: d.name,
                customer_email: d.email,
                customer_phone: d.phone,
                message: d.message,
                status: d.status || 'pending',
                // Items array එක item_details ලෙස map කිරීම
                item_details: d.items?.map((i: any) => ({
                    name: i.product_name || `Product ID: ${i.product_id}`,
                    quantity: i.quantity
                })) || [],
                created_at: d.submittedAt?.toDate() || new Date(),
            };
        });
        return { data };
    },

    // 2. ඉල්ලීමක් ප්‍රතික්ෂේප කිරීම (Reject)
    async rejectRequest(id: string) {
        const docRef = doc(db, "quotations", id);
        return await updateDoc(docRef, { status: 'rejected' });
    },

    // 3. පාරිභෝගිකයාට පිළිතුරු යැවීම (Reply)
    async replyToRequest(id: string, replyData: { message: string; mode: string; file?: File }) {
        let pdfUrl = null;

        // PDF එකක් තිබේ නම් එය Storage එකට Upload කිරීම
        if (replyData.file) {
            const fileRef = ref(storage, `replies/${id}_${Date.now()}.pdf`);
            await uploadBytes(fileRef, replyData.file);
            pdfUrl = await getDownloadURL(fileRef);
        }

        // Firestore එකේ Status එක Update කිරීම සහ Reply විස්තර සේව් කිරීම
        const docRef = doc(db, "quotations", id);
        return await updateDoc(docRef, {
            status: 'replied',
            reply_message: replyData.message,
            reply_pdf_url: pdfUrl,
            repliedAt: new Date()
        });
        
        // සටහන: මෙහිදී Status එක 'replied' වූ සැනින් තවත් Cloud Function එකක් 
        // මගින් පාරිභෝගිකයාට එම PDF එක සහිත Email එකක් යැවීමට සැකසිය හැක.
    },

    // 4. Quotation Request එකක් Create කිරීම
    async createQuotationRequest(data: { name: string; email: string; phone: string; message?: string; items: any[] }) {
        return await addDoc(collection(db, "quotations"), {
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message || '',
            items: data.items,
            status: 'pending',
            submittedAt: serverTimestamp()
        });
    },

    // 5. Quotation එකක් Update කිරීම (Admin)
    async updateQuotation(id: string, data: any) {
        const docRef = doc(db, "quotations", id);
        return await updateDoc(docRef, data);
    }
};