import { api } from '@/lib/api';

export interface GalleryItem {
    id: number;
    title: string;
    description: string;
    image_path: string;
    created_at?: string;
}

export const galleryService = {
    async getGalleryImages(): Promise<GalleryItem[]> {
        const response = await api.get('/api/gallery');
        return response.data.data;
    },

    async uploadGalleryImage(formData: FormData): Promise<GalleryItem> {
        const response = await api.post('/api/gallery', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    async deleteGalleryImage(id: number): Promise<void> {
        await api.delete(`/api/gallery/${id}`);
    }
};
