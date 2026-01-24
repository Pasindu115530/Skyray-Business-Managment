'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Save, X, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useLocalStorage } from '@/hooks/use-local-storage';
import ProjectsTable from '@/components/admin/projects-table';
import { toast } from 'sonner';

interface Project {
    id: number;
    title: string;
    client: string;
    description: string;
    completion_date: string;
    status: string;
    thumbnail_path?: string;
}

export default function AddProjectPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    // Removed local error/success states in favor of toast
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    const [formData, setFormData] = useLocalStorage('admin_add_project_form', {
        title: '',
        client: '',
        description: '',
        completion_date: '',
        status: 'In Progress',
    });

    const [projects, setProjects] = useState<Project[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(false);

    const fetchProjects = async () => {
        setProjectsLoading(true);
        try {
            const response = await api.get('/api/projects');
            setProjects(response.data.data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
            toast.error('Failed to fetch projects');
        } finally {
            setProjectsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setThumbnailPreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setGalleryImages(prev => [...prev, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index: number) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Saving project...');

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('client', formData.client);
            submitData.append('description', formData.description);
            submitData.append('completion_date', formData.completion_date);
            submitData.append('status', formData.status);
            if (thumbnail) {
                submitData.append('thumbnail', thumbnail);
            }
            galleryImages.forEach((image, index) => {
                submitData.append(`project_images[${index}]`, image);
            });

            const response = await api.post('/api/projects', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Project added successfully!', { id: toastId });

            // Refresh and Clear
            fetchProjects();
            setFormData({
                title: '',
                client: '',
                description: '',
                completion_date: '',
                status: 'In Progress',
            });
            setThumbnail(null);
            setThumbnailPreview('');
            setGalleryImages([]);
            setGalleryPreviews([]);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.message ||
                'Failed to add project';
            toast.error(errorMessage, { id: toastId });
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 tracking-tight">Add Project</h1>
                    <p className="text-slate-500 mt-2 text-sm">Showcase a new project in your portfolio with details and gallery.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => router.back()} className="border-slate-200 text-slate-600 hover:bg-slate-50">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100">
                        {isLoading ? 'Saving...' : (
                            <>
                                <Save className="h-4 w-4" />
                                <span className="hidden sm:inline">Save Project</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg font-bold text-slate-800">Project Details</CardTitle>
                            <CardDescription className="text-slate-500">Basic information about the automation project.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Project Title <span className="text-rose-500">*</span></label>
                                    <Input
                                        name="title"
                                        placeholder="e.g. Factory Automation System"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="focus-visible:ring-indigo-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Client / Customer</label>
                                    <div className="relative group">
                                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <Input
                                            name="client"
                                            className="pl-9 focus-visible:ring-indigo-500"
                                            placeholder="Select or type client name"
                                            value={formData.client}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    name="description"
                                    className="flex min-h-[150px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                    placeholder="Describe the project goals, challenges, and solutions..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg font-bold text-slate-800">Specifications</CardTitle>
                            <CardDescription className="text-slate-500">Timeline and status details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Completion Date</label>
                                    <div className="relative group">
                                        <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <Input
                                            name="completion_date"
                                            type="date"
                                            className="pl-9 focus-visible:ring-indigo-500"
                                            value={formData.completion_date}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Status</label>
                                    <select
                                        name="status"
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option>In Progress</option>
                                        <option>Completed</option>
                                        <option>Maintenance</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar / Media */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base font-bold text-slate-800">Project Thumbnail</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div
                                className="border-2 border-dashed border-slate-200 rounded-xl h-48 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-indigo-500 transition-all cursor-pointer group bg-slate-50/30"
                                onClick={() => document.getElementById('thumbnail-input')?.click()}
                            >
                                {thumbnailPreview ? (
                                    <div className="relative w-full h-full p-1">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Preview"
                                            className="h-full w-full object-cover rounded-lg shadow-sm"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                            <span className="text-white text-xs font-medium">Change Image</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="h-10 w-10 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-700 transition-colors">Click to upload</span>
                                        <span className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                                    </>
                                )}
                            </div>
                            <input
                                id="thumbnail-input"
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="hidden"
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-base font-bold text-slate-800">Project Gallery</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {galleryPreviews.map((preview, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200 shadow-sm">
                                        <img src={preview} alt="Gallery" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            className="absolute top-1 right-1 bg-white text-rose-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-rose-50"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                <div
                                    className="aspect-square border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-indigo-500 transition-all cursor-pointer group"
                                    onClick={() => document.getElementById('gallery-input')?.click()}
                                >
                                    <Upload className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 mb-1 transition-colors" />
                                    <span className="text-[10px] text-slate-500 group-hover:text-indigo-600 font-medium">Add</span>
                                </div>
                            </div>
                            <input
                                id="gallery-input"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryChange}
                                className="hidden"
                            />
                            <p className="text-xs text-slate-400 text-center">Upload multiple images for the project gallery.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Existing Projects Table */}
            <div className="mt-12 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Existing Projects</h3>
                    <p className="text-sm text-slate-500">Manage your current project portfolio.</p>
                </div>
                <div className="p-0">
                    <ProjectsTable projects={projects} onRefresh={fetchProjects} isLoading={projectsLoading} />
                </div>
            </div>
        </div>
    );
}
