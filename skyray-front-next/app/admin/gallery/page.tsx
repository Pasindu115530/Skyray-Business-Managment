'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminNavigation from '@/app/components/AdminNavigation';

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

// Fake gallery data
const fakeGalleryImages: GalleryImage[] = [
  { id: 1, title: 'Modern Office Design', description: 'Contemporary office space with ergonomic furniture', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', category: 'office', createdAt: '2026-01-01' },
  { id: 2, title: 'Team Building Event', description: 'Annual team building activity', imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400', category: 'events', createdAt: '2026-01-02' },
  { id: 3, title: 'E-commerce Website', description: 'Fully responsive online store', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', category: 'projects', createdAt: '2026-01-03' },
  { id: 4, title: 'Mobile App Interface', description: 'Clean and modern app design', imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400', category: 'projects', createdAt: '2026-01-04' },
  { id: 5, title: 'Company Celebration', description: 'Celebrating project success', imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400', category: 'events', createdAt: '2026-01-05' },
  { id: 6, title: 'Product Launch', description: 'New product unveiling event', imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400', category: 'products', createdAt: '2026-01-06' },
];

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>(fakeGalleryImages);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    category: 'projects'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newImage: GalleryImage = {
      id: images.length + 1,
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      category: formData.category,
      createdAt: new Date().toISOString()
    };
    setImages([newImage, ...images]);
    setShowModal(false);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      category: 'projects'
    });
    alert('Image added successfully!');
  };

  const deleteImage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    setImages(images.filter(img => img.id !== id));
    alert('Image deleted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNavigation onLogout={() => console.log('Logout')} />

      {/* Main Content */}
      <div className="pt-20 md:pt-24 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gallery Photo Management</h1>
              <p className="text-gray-600 mt-2">Add and manage gallery images</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
            >
              + Upload Photo
            </button>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {image.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{image.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{image.description}</p>
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 text-lg mt-4">No images found. Upload your first photo!</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Photo Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Upload New Photo</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photo Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter photo title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter photo description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="projects">Projects</option>
                    <option value="team">Team</option>
                    <option value="office">Office</option>
                    <option value="events">Events</option>
                    <option value="products">Products</option>
                  </select>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                  >
                    Upload Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
