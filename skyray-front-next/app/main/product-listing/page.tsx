'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { productCategories } from '@/app/data/productsData';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: number;
  category: string;
  name: string;
  description: string;
  image_url: string | null;
  specifications: string | null;
  datasheet_path: string | null;
}

function ProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedProducts, setAddedProducts] = useState<Set<number>>(new Set());

  const category = productCategories.find(c => c.id === categoryId);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch products, optionally filtering by category if provided
        const url = categoryId
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?category=${encodeURIComponent(categoryId)}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          // Handle wrapped response
          const productsArray = Array.isArray(data) ? data : (data.data || []);
          setProducts(productsArray);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProducts();
    }
  }, [categoryId]);


  const [redirectingId, setRedirectingId] = useState<number | null>(null);

  useEffect(() => {
    if (products.length > 0) {
      console.log("Products Debug:", products);
    }
  }, [products]);

  const handleRequestQuote = (product: Product) => {
    setRedirectingId(product.id);
    // Add small delay for visual feedback
    setTimeout(() => {
      router.push(`/main/quotation?product=${product.id}&name=${encodeURIComponent(product.name)}`);
    }, 600);
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
            onClick={() => router.push('/main/cart-categories')}
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
          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No products found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {product.image_url ? (
                      <Image
                        src={product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}${product.image_url.startsWith('/') ? '' : '/'}${product.image_url}`) : ''}
                        alt={product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl text-gray-900 mb-2 font-bold">{product.name}</h3>
                    <div className="mb-3 px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full inline-block self-start">
                      {product.category}
                    </div>
                    <p className="text-gray-600 mb-6 text-sm flex-grow line-clamp-3">{product.description}</p>

                    {/* Specs Preview or similar if needed, using specifications field */}
                    {product.specifications && (
                      <div className="mb-4 text-xs text-gray-500 line-clamp-2">
                        {product.specifications}
                      </div>
                    )}

                    <div className="flex flex-col gap-2 mt-auto">
                      {product.datasheet_path && (
                        <a
                          href={product.datasheet_path.startsWith('http') ? product.datasheet_path : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}${product.datasheet_path.startsWith('/') ? '' : '/'}${product.datasheet_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center space-x-2 text-sm font-medium"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Download Datasheet</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleRequestQuote(product)}
                        disabled={redirectingId === product.id}
                        className={`w-full py-3 rounded-lg transition-all flex items-center justify-center space-x-2 font-medium ${redirectingId === product.id
                          ? 'bg-indigo-500 text-white cursor-wait'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                          }`}
                      >
                        {redirectingId === product.id ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Redirecting...</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-5 h-5" />
                            <span>Request Quotation</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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