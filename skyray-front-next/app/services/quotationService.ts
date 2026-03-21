import api from './api';

export interface Quotation {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    message: string | null;
    item_details: any;
    status: 'pending' | 'replied' | 'rejected';
    created_at: string;
    updated_at: string;
}

export const quotationService = {
    getAll: async () => {
        const response = await api.get('/admin/quotations');
        return response.data;
    },

    reply: async (id: number, message: string, pdfFile: File | null) => {
        const formData = new FormData();
        if (message) {
            formData.append('message', message);
        }
        if (pdfFile) {
            formData.append('pdf_file', pdfFile);
        }

        const response = await api.post(`/admin/quotations/${id}/reply`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    reject: async (id: number) => {
        const response = await api.post(`/admin/quotations/${id}/reject`);
        return response.data;
    }
};
