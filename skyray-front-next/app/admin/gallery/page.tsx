'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function GalleryPage() {
    interface GalleryImage {
        id: number;
        url: string;
        name: string;
        description: string;
    }

    const [images, setImages] = useState<GalleryImage[]>([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Upload Form State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = () => {
        if (!selectedFile || !previewUrl) {
            toast.error('Please select an image');
            return;
        }

        if (!formData.name) {
            toast.error('Please enter an image name');
            return;
        }

        setUploading(true);
        // Simulate API call
        setTimeout(() => {
            const newImage: GalleryImage = {
                id: Date.now(),
                url: previewUrl,
                name: formData.name,
                description: formData.description
            };
            setImages(prev => [newImage, ...prev]);

            // Reset and Close
            setUploading(false);
            setIsUploadOpen(false);
            setSelectedFile(null);
            setPreviewUrl(null);
            setFormData({ name: '', description: '' });
            toast.success('Image added successfully');
        }, 800);
    };

    const removeImage = (id: number) => {
        setImages(prev => prev.filter(img => img.id !== id));
        toast.success('Image removed');
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

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                            <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800">Gallery Images</CardTitle>
                            <CardDescription className="text-slate-500">View and manage uploaded assets.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {images.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {images.map((img) => (
                                <div key={img.id} className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                                        <img
                                            src={img.url}
                                            alt={img.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-start justify-end p-2 opacity-0 group-hover:opacity-100">
                                            <button
                                                onClick={() => removeImage(img.id)}
                                                className="p-1.5 bg-white text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shadow-sm"
                                                title="Delete Image"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-semibold text-slate-800 truncate" title={img.name}>{img.name}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 h-8">
                                            {img.description || 'No description provided.'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                                <ImageIcon className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No images yet</h3>
                            <p className="text-slate-500 mt-1 mb-6">Upload images with details to get started.</p>
                            <Button variant="outline" onClick={() => setIsUploadOpen(true)}>
                                Add Your First Image
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

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
        </div>
    );
}
