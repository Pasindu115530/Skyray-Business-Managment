"use client"; // Required for Framer Motion animations

import React from 'react';
import { motion } from 'framer-motion'; // Standard Next.js import for motion
import { Target, Eye, Award, Users, Zap, Shield, TrendingUp, Heart } from 'lucide-react';

export default function AboutPage() {
  const milestones = [
    { year: '2020', title: 'Company Founded', description: 'Started with a vision to revolutionize electrical engineering' },
    { year: '2013', title: 'First Major Project', description: 'Completed 10MW power distribution system' },
    { year: '2016', title: 'Expansion', description: 'Opened three new regional offices' },
    { year: '2019', title: 'Industry Recognition', description: 'Won National Engineering Excellence Award' },
    { year: '2022', title: '500+ Projects', description: 'Reached milestone of 500 completed projects' },
    { year: '2024', title: 'Innovation Leader', description: 'Launched AI-powered automation division' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'We prioritize safety in every project, adhering to the highest industry standards.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Delivering exceptional quality and exceeding client expectations consistently.',
    },
    {
      icon: Heart,
      title: 'Integrity',
      description: 'Operating with honesty, transparency, and ethical business practices.',
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Embracing cutting-edge technology and innovative engineering solutions.',
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#0a0a14] via-[#1a1a2e] to-[#0a0a14] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,21,56,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,21,56,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block mb-6"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(212, 175, 55, 0.3)',
                  '0 0 40px rgba(212, 175, 55, 0.6)',
                  '0 0 20px rgba(212, 175, 55, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-16 h-16 text-[#D4AF37]" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl text-white mb-6">
              About <span className="bg-gradient-to-r from-[#8B1538] to-[#D4AF37] bg-clip-text text-transparent">SkyRay</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Engineering excellence since 2020. Powering industries with innovative electrical solutions and unwavering commitment to quality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative p-8 bg-gradient-to-br from-[#8B1538]/5 to-[#D4AF37]/5 rounded-2xl"
            >
              <div className="inline-flex p-4 bg-gradient-to-br from-[#8B1538] to-[#D4AF37] rounded-xl mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl mb-4 text-gray-900">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
               We supply equipment and accessories required for engineering works. To improve the efficiency of the production process in factories and the quality of products, we also specialize in the automation of machines. Additionally, we design and supply new machines and the necessary accessories and equipment.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative p-8 bg-gradient-to-br from-[#8B1538]/5 to-[#D4AF37]/5 rounded-2xl"
            >
              <div className="inline-flex p-4 bg-gradient-to-br from-[#8B1538] to-[#D4AF37] rounded-xl mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl mb-4 text-gray-900">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                We are committed to helping our customers find engineering solutions that deliver immediate and long-term, bottom-line results.


              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group p-6 bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#8B1538] to-[#D4AF37] rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl mb-3 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section and Team Section remain same as your original code */}
      {/* ... */}
    </div>
  );
}