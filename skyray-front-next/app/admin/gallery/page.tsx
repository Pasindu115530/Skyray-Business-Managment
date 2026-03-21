'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import { galleryService, GalleryItem } from '@/services/galleryService';
import EditGalleryModal from '@/components/admin/edit-gallery-modal';

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

    // Upload Form State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'General'
    });

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const data = await galleryService.getGalleryImages();
            setImages(data);
        } catch (error) {
            console.error('Failed to fetch gallery images', error);
            toast.error('Failed to load gallery images');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        if (!selectedFile) {
            toast.error('Please select an image');
            return;
        }

        if (!formData.name) {
            toast.error('Please enter an image name');
            return;
        }

        setUploading(true);
        try {
            const submitData = new FormData();
            submitData.append('title', formData.name);
            submitData.append('description', formData.description);
            submitData.append('category', formData.category);
            submitData.append('image', selectedFile);

            await galleryService.uploadGalleryImage(submitData);

            // Refresh list
            await fetchImages();

            // Reset and Close
            setIsUploadOpen(false);
            setSelectedFile(null);
            setPreviewUrl(null);
            setFormData({ name: '', description: '', category: 'General' });
            toast.success('Image added successfully');
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            await galleryService.deleteGalleryImage(id);
            setImages(prev => prev.filter(img => img.id !== id));
            toast.success('Image removed');
        } catch (error) {
            console.error('Delete failed', error);
            toast.error('Failed to delete image');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 tracking-tight">
                        Gallery Management
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm max-w-lg">
                        Manage your standalone gallery images. Add names and details to organize your portfolio.
                    </p>
                </div>
                <div>
                    <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all gap-2"
                        onClick={() => setIsUploadOpen(true)}
                    >
                        <Upload className="w-4 h-4" />
                        Upload New
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-700">Gallery Images</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500">Image</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Category</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Description</th>
                                <th className="px-6 py-3 font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center">
                                            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="ml-2">Loading images...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : images.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No images found. Upload one above.
                                    </td>
                                </tr>
                            ) : (
                                images.map((img) => (
                                    <tr key={img.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border">
                                                <img
                                                    src={img.image_path}
                                                    alt={img.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-gray-900">{img.title}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {img.category && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    {img.category}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                                            {img.description || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => setEditingItem(img)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => removeImage(img.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Modal for Upload */}
            {isUploadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsUploadOpen(false)}
                    />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800">Add New Image</h3>
                            <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Image Preview / Dropzone */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Image File <span className="text-rose-500">*</span></label>
                                <div
                                    className={`border-2 border-dashed rounded-lg h-48 flex flex-col items-center justify-center text-center cursor-pointer transition-all overflow-hidden relative ${previewUrl ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 hover:bg-slate-50 hover:border-indigo-400'}`}
                                    onClick={() => document.getElementById('modal-upload')?.click()}
                                >
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <>
                                            <div className="p-3 bg-slate-100 rounded-full mb-2">
                                                <Upload className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-600">Click to upload</span>
                                            <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                                        </>
                                    )}
                                    <input
                                        id="modal-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Name <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    placeholder="e.g. Factory Interior"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Brief details about this image..."
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Category <span className="text-rose-500">*</span></label>
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
                        </div>

                        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                            <Button variant="outline" onClick={() => setIsUploadOpen(false)} disabled={uploading}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={uploading || !selectedFile} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[100px]">
                                {uploading ? 'Saving...' : 'Save Image'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <EditGalleryModal
                isOpen={!!editingItem}
                onClose={() => setEditingItem(null)}
                item={editingItem}
                onSuccess={fetchImages}
            />
        </div>
    );
}
