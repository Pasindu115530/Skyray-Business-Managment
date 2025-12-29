"use client"; 

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

const categories = ['All', 'Projects', 'Panels', 'Automation', 'Training', 'Installations'];

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<any[]>([]); // Dynamic state
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<any | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Fetch from MySQL
  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch('/api/gallery');
        const data = await res.json();
        setGalleryImages(data);
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter((img) => img.category === selectedCategory);

  const openLightbox = (image: any, index: number) => {
    setLightboxImage(image);
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxImage(null);

  const nextImage = () => {
    const nextIndex = (lightboxIndex + 1) % filteredImages.length;
    setLightboxImage(filteredImages[nextIndex]);
    setLightboxIndex(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxImage(filteredImages[prevIndex]);
    setLightboxIndex(prevIndex);
  };

  if (loading) return <div className="pt-40 text-center text-gray-500">Loading Gallery...</div>;

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-orange-500 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
             <ImageIcon className="w-20 h-20 text-white mx-auto mb-6" />
             <h1 className="text-5xl md:text-6xl text-white mb-6">Project <span className="text-blue-900">Gallery</span></h1>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white sticky top-20 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center flex-wrap gap-3">
          <Filter className="w-5 h-5 text-gray-500" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${selectedCategory === category ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg' : 'bg-gray-100 text-gray-700'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="wait">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => openLightbox(image, index)}
                className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer shadow-md"
              >
                <img src={image.url} alt={image.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                  <span className="text-xs bg-orange-500 w-fit px-2 py-1 rounded-full mb-2">{image.category}</span>
                  <h3 className="font-semibold">{image.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox Implementation */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white"><X className="w-8 h-8" /></button>
            <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <img src={lightboxImage.url} className="w-full rounded-lg max-h-[80vh] object-contain" />
              <div className="text-center text-white mt-4">
                <h2 className="text-2xl font-bold">{lightboxImage.title}</h2>
                <p className="text-gray-300">{lightboxImage.description}</p>
              </div>
            </div>
            {filteredImages.length > 1 && (
              <>
                <button onClick={(e) => {e.stopPropagation(); prevImage();}} className="absolute left-4 text-white"><ChevronLeft className="w-10 h-10" /></button>
                <button onClick={(e) => {e.stopPropagation(); nextImage();}} className="absolute right-4 text-white"><ChevronRight className="w-10 h-10" /></button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}