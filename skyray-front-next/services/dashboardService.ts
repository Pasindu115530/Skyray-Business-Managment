import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export interface DashboardStats {
    stats: {
        total: number;
        pending: number;
        quoted: number;
        reviewed: number;
    };
    recent_requests: {
        id: string;
        customer: string;
        email: string;
        date: string;
        status: string;
        amount: string;
    }[];
}

export const dashboardService = {
    async getStats(): Promise<DashboardStats> {
        try {
            const requestsRef = collection(db, 'quotation_requests');
            const allDocs = await getDocs(requestsRef);
            
            let total = 0, pending = 0, quoted = 0, reviewed = 0;
            
            allDocs.forEach(doc => {
                total++;
                const data = doc.data();
                if (data.status === 'pending') pending++;
                if (data.status === 'quoted') quoted++;
                if (data.status === 'reviewed') reviewed++;
            });

            const recent_requests: any[] = [];
            const recentQuery = query(requestsRef, orderBy('createdAt', 'desc'), limit(5));
            const recentDocs = await getDocs(recentQuery);
            
            recentDocs.forEach(doc => {
                const data = doc.data();
                recent_requests.push({
                    id: doc.id,
                    customer: data.name || data.customer || 'Unknown',
                    email: data.email || '',
                    date: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : new Date().toLocaleDateString(),
                    status: data.status || 'pending',
                    amount: data.amount ? `$${data.amount}` : 'N/A'
                });
            });

            return {
                stats: { total, pending, quoted, reviewed },
                recent_requests
            };
        } catch (error) {
            console.error('Error fetching dashboard stats from Firebase:', error);
            return {
                stats: { total: 0, pending: 0, quoted: 0, reviewed: 0 },
                recent_requests: []
            };
        }
    },
};
