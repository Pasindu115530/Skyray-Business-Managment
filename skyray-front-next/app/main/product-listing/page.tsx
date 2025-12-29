"use client"; // Required for hooks and framer-motion

import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { productsData, productCategories } from '@/app/data/productsData';
import Link from 'next/link';

function ProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Replaces the categoryId prop from your old App.tsx
  const categoryId = searchParams.get('category');
  
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  
  const category = productCategories.find(c => c.id === categoryId);
  const products = productsData.filter(p => p.category === categoryId);

  // Note: In Next.js, 'addToCart' should move to a Global StoreContext
  const handleAddToCart = (product: any) => {
    // In your final build, call your context addToCart here
    setAddedProducts(new Set(addedProducts).add(product.id));
    
    setTimeout(() => {
      setAddedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  if (!category) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-4">Category not found</h2>
          <Link
            href="/main/cart-categories"
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push('/cart-categories')}
            className="flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Categories
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-5xl mb-4">{category.icon}</div>
            <h1 className="text-4xl md:text-5xl text-white mb-4">
              {category.title}
            </h1>
            <p className="text-xl text-blue-100">
              {category.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl text-gray-900 mb-2">{product.name}</h3>
                  <div className="mb-3 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full inline-block">
                    {product.specs}
                  </div>
                  <p className="text-gray-600 mb-6 text-sm">{product.description}</p>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addedProducts.has(product.id)}
                    className={`w-full py-3 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                      addedProducts.has(product.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-orange-500 text-white hover:shadow-lg'
                    }`}
                  >
                    {addedProducts.has(product.id) ? (
                      <><Check className="w-5 h-5" /><span>Added</span></>
                    ) : (
                      <><ShoppingCart className="w-5 h-5" /><span>Add to Cart</span></>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Next.js requires components using useSearchParams to be wrapped in Suspense
export default function ProductListingPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center">Loading products...</div>}>
      <ProductContent />
    </Suspense>
  );
}