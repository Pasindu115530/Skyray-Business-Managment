"use client"; 

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Settings, Factory, Filter } from 'lucide-react';

const projectsData = [
  {
    id: 1,
    title: 'Metropolitan Power Distribution',
    category: 'Electrical Installations',
    description: '25MW power distribution system for downtown commercial district',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
    year: '2024',
    client: 'City Infrastructure Corp',
  },
  {
    id: 2,
    title: 'Smart Factory Automation',
    category: 'Automation Solutions',
    description: 'Complete automation system with AI-powered monitoring',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
    year: '2024',
    client: 'TechManufacture Inc',
  },
  {
    id: 3,
    title: 'Industrial Complex Power System',
    category: 'Industrial Power Systems',
    description: 'High-voltage power infrastructure for manufacturing facility',
    image: 'https://images.unsplash.com/photo-1581092160607-ee67e0e62837?w=800',
    year: '2023',
    client: 'Global Industries Ltd',
  },
  {
    id: 4,
    title: 'Hospital Backup Power',
    category: 'Electrical Installations',
    description: 'Emergency power system with redundancy for medical center',
    image: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=800',
    year: '2023',
    client: 'Central Hospital',
  },
  {
    id: 5,
    title: 'Warehouse Automation',
    category: 'Automation Solutions',
    description: 'Automated material handling and power management system',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    year: '2024',
    client: 'LogisticsPro Corp',
  },
  {
    id: 6,
    title: 'Renewable Energy Integration',
    category: 'Industrial Power Systems',
    description: 'Solar and grid power integration for industrial park',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800',
    year: '2023',
    client: 'Green Energy Solutions',
  },
  {
    id: 7,
    title: 'Data Center Power Infrastructure',
    category: 'Electrical Installations',
    description: 'Redundant power system for mission-critical facility',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    year: '2024',
    client: 'CloudTech Systems',
  },
  {
    id: 8,
    title: 'Manufacturing Plant Upgrade',
    category: 'Industrial Power Systems',
    description: 'Complete electrical system modernization',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    year: '2023',
    client: 'Industrial Dynamics',
  },
  {
    id: 9,
    title: 'Smart Building Controls',
    category: 'Automation Solutions',
    description: 'Integrated building management and automation system',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    year: '2024',
    client: 'Commercial Properties Inc',
  },
];

const categories = ['All Projects', 'Electrical Installations', 'Industrial Power Systems', 'Automation Solutions'];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All Projects');

  const filteredProjects =
    selectedCategory === 'All Projects'
      ? projectsData
      : projectsData.filter((project) => project.category === selectedCategory);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-[#0a0a14] via-[#1a1a2e] to-[#0a0a14]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,21,56,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,21,56,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-6"
            >
              <Zap className="w-16 h-16 text-[#D4AF37]" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl text-white mb-4">
              Our <span className="bg-gradient-to-r from-[#8B1538] to-[#D4AF37] bg-clip-text text-transparent">Projects</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Showcasing excellence in electrical engineering and industrial solutions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center flex-wrap gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#8B1538] to-[#D4AF37] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <motion.div
                        className="px-3 py-1 bg-gradient-to-r from-[#8B1538] to-[#D4AF37] text-white text-sm rounded-full"
                        whileHover={{ scale: 1.1 }}
                      >
                        {project.category === 'Electrical Installations' && <Zap className="w-4 h-4 inline mr-1" />}
                        {project.category === 'Industrial Power Systems' && <Factory className="w-4 h-4 inline mr-1" />}
                        {project.category === 'Automation Solutions' && <Settings className="w-4 h-4 inline mr-1" />}
                      </motion.div>
                    </div>

                    {/* Year */}
                    <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                      {project.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl mb-2 text-gray-900 group-hover:text-[#8B1538] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{project.client}</span>
                      <motion.div
                        className="w-8 h-8 bg-gradient-to-r from-[#8B1538] to-[#D4AF37] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.2, rotate: 90 }}
                      >
                        <Zap className="w-4 h-4 text-white" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Hover Border Effect */}
                  <motion.div
                    className="absolute inset-0 border-2 border-transparent group-hover:border-[#D4AF37] rounded-xl pointer-events-none transition-colors"
                    initial={false}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '1000+', label: 'Projects Completed' },
              { value: '500+', label: 'Happy Clients' },
              { value: '50+', label: 'Countries Served' },
              { value: '24/7', label: 'Support Available' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl text-[#8B1538] mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
