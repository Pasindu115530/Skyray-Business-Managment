"use client"; // Required for Framer Motion and Hooks

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, FileText, ChevronRight } from 'lucide-react';
import { servicesData } from '@/app/data/servicesData'; // Adjust path based on your alias
import { useRouter, useParams } from 'next/navigation'; // Use useParams to get the ID
import Link from 'next/link';

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string; // Capture the dynamic [id] from the URL

  const service = servicesData.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-gray-900 mb-4">Service not found</h2>
          <Link href="/services" className="text-blue-600 hover:text-blue-700">
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <section className="relative h-96 overflow-hidden">
        <motion.img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/70" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <button
              onClick={() => router.push('/services')}
              className="flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Services
            </button>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl text-white mb-4 max-w-4xl"
            >
              {service.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl text-blue-100 max-w-2xl"
            >
              {service.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
                <h2 className="text-3xl text-gray-900 mb-4">Overview</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {service.detailedDescription}
                </p>
              </motion.div>

              {/* Key Features */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
                <h2 className="text-3xl text-gray-900 mb-6">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
                  <h3 className="text-2xl mb-4">Interested?</h3>
                  <button
                    onClick={() => router.push('/quotation')}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all"
                  >
                    Request Quotation
                  </button>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl text-gray-900 mb-4">Related Services</h3>
                  <div className="space-y-3">
                    {servicesData
                      .filter(s => s.id !== serviceId)
                      .slice(0, 3)
                      .map((relatedService) => (
                        <button
                          key={relatedService.id}
                          onClick={() => router.push(`/services/${relatedService.id}`)}
                          className="w-full text-left p-3 bg-white rounded-lg hover:shadow-md transition-all text-sm"
                        >
                          {relatedService.title}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}