'use client';

import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { galleryService, GalleryItem } from '@/services/galleryService';

interface EditGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: GalleryItem | null;
    onSuccess: () => void;
}

export default function EditGalleryModal({ isOpen, onClose, item, onSuccess }: EditGalleryModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'General',
    });

    useEffect(() => {
        if (item) {
            setFormData({
                title: item.title || '',
                description: item.description || '',
                category: item.category || 'General',
            });
            setPreviewUrl(item.image_path || null);
            setSelectedFile(null);
        }
    }, [item]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!item) return;
        if (!formData.title) {
            toast.error('Please enter a name');
            return;
        }

        setIsLoading(true);
        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('category', formData.category);
            submitData.append('_method', 'PUT');

            if (selectedFile) {
                submitData.append('image', selectedFile);
            }

            await galleryService.updateGalleryImage(item.id, submitData);
            toast.success('Image updated successfully');
            onSuccess();
            onClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update image';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Edit Gallery Image</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Image Preview */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Image</label>
                        <div
                            className={`border-2 border-dashed rounded-lg h-48 flex flex-col items-center justify-center text-center cursor-pointer transition-all overflow-hidden relative ${previewUrl ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:bg-slate-50 hover:border-indigo-400'}`}
                            onClick={() => document.getElementById('edit-gallery-upload')?.click()}
                        >
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                            ) : (
                                <span className="text-sm text-slate-500">Click to select new image</span>
                            )}
                            <input
                                id="edit-gallery-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </div>
                        <p className="text-[10px] text-slate-400">Upload new image to replace existing.</p>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Name <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Category</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        >
                            <option>General</option>
                            <option>Electrical Installations</option>
                            <option>Industrial Power Systems</option>
                            <option>Automation Solutions</option>
                            <option>Gallery</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Description</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px] gap-2">
                        {isLoading ? 'Saving...' : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
