import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export const dashboardService = {
    async getStats() {
        try {
            const querySnapshot = await getDocs(collection(db, "quotations"));
            const allDocs = querySnapshot.docs.map(doc => doc.data());

            // ප්‍රමාණ ගණනය කිරීම (Stats Calculation)
            const stats = {
                total: allDocs.length,
                pending: allDocs.filter(d => d.status === 'pending').length,
                quoted: allDocs.filter(d => d.status === 'replied').length,
                reviewed: allDocs.filter(d => d.status === 'rejected').length, // හෝ වෙනත් status එකක්
            };

            // අලුත්ම ඉල්ලීම් 5 ලබා ගැනීම (Recent 5 Requests)
            const recentQuery = query(
                collection(db, "quotations"), 
                orderBy("submittedAt", "desc"), 
                limit(5)
            );
            const recentSnapshot = await getDocs(recentQuery);
            
            const recent_requests = recentSnapshot.docs.map(doc => {
                const d = doc.data();
                return {
                    id: doc.id.substring(0, 6).toUpperCase(), // කෙටි ID එකක් පෙන්වීමට
                    customer: d.name,
                    email: d.email,
                    date: d.submittedAt?.toDate().toLocaleDateString() || 'N/A',
                    status: this.mapStatus(d.status),
                    amount: d.estimated_amount || '-' // ඔබට අවශ්‍ය නම් මුදලක් එකතු කළ හැක
                };
            });

            return { stats, recent_requests };
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            throw error;
        }
    },

    // UI එකේ ඇති Status නම් වලට ගැලපෙන සේ සැකසීම
    mapStatus(status: string) {
        switch(status?.toLowerCase()) {
            case 'replied': return 'Quoted';
            case 'pending': return 'Pending';
            case 'rejected': return 'Rejected';
            default: return 'Pending';
        }
    }
};