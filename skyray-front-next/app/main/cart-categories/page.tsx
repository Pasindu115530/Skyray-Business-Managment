"use client"; // Required for Framer Motion and useRouter hooks

import React from 'react';
import { motion } from 'framer-motion'; // Next.js standard import
import { Package, ArrowRight } from 'lucide-react';
import { productCategories } from '@/app/data/productsData'; // Use path alias
import { useRouter } from 'next/navigation'; // Next.js navigation hook

export default function CartCategoriesPage() {
  const router = useRouter();

  // Replaces onSelectCategory state switcher
  const handleSelectCategory = (categoryId: string) => {
    // Navigate using query parameters
    router.push(`/main/product-listing?category=${categoryId}`);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-orange-600 via-orange-500 to-orange-700 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Package className="w-20 h-20 text-white" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl text-white mb-6">
              Product <span className="text-blue-900">Catalog</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
              Browse our comprehensive range of industrial automation and electrical products
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600">
              Select a category to view available products
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.03 }}
                onClick={() => handleSelectCategory(category.id)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative p-8">
                  <motion.div
                    className="text-6xl mb-6"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {category.icon}
                  </motion.div>

                  <h3 className="text-2xl text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>

                  <p className="text-gray-600 mb-6">
                    {category.description}
                  </p>

                  <div className="flex items-center text-orange-600 group-hover:text-blue-600 transition-colors">
                    <span className="mr-2">View Items</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                <motion.div
                  className="h-2 bg-gradient-to-r from-blue-600 to-orange-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl text-gray-900 mb-4">
              Need Something Specific?
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Can&apos;t find what you&apos;re looking for? Request a custom quotation for specialized products.
            </p>
            <motion.button
              onClick={() => router.push('/quotation')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request Custom Quotation
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}