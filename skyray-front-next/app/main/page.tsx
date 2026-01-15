"use client"; // Mandatory for hooks and animations

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion'; // Next.js standard import
import { Zap, Shield, Award, ArrowRight, TrendingUp, Users, Clock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Replaces navigateTo
import logo from '@/public/skyraylogo.jpg'; // Adjust path based on your alias
import { productCategories } from '../data/productsData';
import JsonLd from '@/components/JsonLd';

export default function Home() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Handle category click using Next.js routing
  const handleSelectCategory = (categoryId: string) => {
    // In Next.js, we pass data via URL parameters or Global Context
    router.push(`/main/product-listing?category=${categoryId}`);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(139, 21, 56, ${(1 - distance / 150) * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        ctx.fillStyle = '#D4AF37';
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 10;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Cutting-edge solutions delivering maximum efficiency and reliability',
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Industry-leading safety standards and certified installations',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Award-winning engineering team with decades of experience',
    },
  ];

  const stats = [
    { icon: Users, value: '500+', label: 'Satisfied Clients' },
    { icon: Award, value: '1000+', label: 'Projects Completed' },
    { icon: TrendingUp, value: '99%', label: 'Success Rate' },
    { icon: Clock, value: '24/7', label: 'Support Available' },
  ];



  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "SkyRay Engineering Solutions",
    "image": "https://www.skyrayengineering.com/skyraylogo.jpg",
    "telephone": "+94-123-456-789",
    "url": "https://www.skyrayengineering.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Engineering Lane",
      "addressLocality": "Colombo",
      "postalCode": "00100",
      "addressCountry": "LK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 6.9271,
      "longitude": 79.8612
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "17:00"
    },
    "priceRange": "$$"
  };

  return (
    <div className="pt-20">
      <JsonLd data={localBusinessSchema} />
      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a14] via-[#1a1a2e] to-[#0a0a14]"
      >
        {/* Animated Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,21,56,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,21,56,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              animate={{
                filter: [
                  'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))',
                  'drop-shadow(0 0 20px rgba(212, 175, 55, 0.8))',
                  'drop-shadow(0 0 10px rgba(212, 175, 55, 0.5))',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Image
                src={logo}
                alt="SkyRay Engineering Solutions"
                className="h-32 w-auto mx-auto mb-8"
                width={128}
                height={128}
              />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl mb-6 text-white"
          >
            Powering Innovation Through
            <br />
            <span className="bg-gradient-to-r from-[#8B1538] to-[#D4AF37] bg-clip-text text-transparent">
              Engineering Excellence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Your trusted partner in electrical engineering, industrial power systems, and automation solutions
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={() => router.push('/main/services')}
              className="group relative px-8 py-4 bg-gradient-to-r from-[#8B1538] to-[#D4AF37] text-white rounded-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#8B1538]"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center space-x-2">
                <span>Our Services</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.button
              onClick={() => router.push('/main/quotation')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Request a Quotation
            </motion.button>

            <motion.button
              onClick={() => router.push('/main/projects')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Our Projects
            </motion.button>

            <motion.button
              onClick={() => router.push('/login')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-[#D4AF37]/50 hover:bg-[#D4AF37]/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Customer Login
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"
            />
          </div>
        </motion.div>
      </motion.section>
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
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <motion.div
                    className="text-6xl mb-6"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {category.icon}
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">
                    {category.description}
                  </p>

                  {/* Button */}
                  <motion.div
                    className="flex items-center text-orange-600 group-hover:text-blue-600 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <span className="mr-2">View Items</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>

                {/* Bottom Accent */}
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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4">
              Why Choose <span className="text-[#8B1538]">SkyRay</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Industry-leading solutions backed by expertise and innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative p-8 bg-gray-50 rounded-xl overflow-hidden cursor-pointer"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[#8B1538]/5 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity"
                />
                <div className="relative">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-[#8B1538] to-[#D4AF37] rounded-lg flex items-center justify-center mb-6"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-[#8B1538] to-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl text-white mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl mb-6">
              Ready to Power Your Next Project?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get in touch with our expert team today and discover how we can help you achieve excellence
            </p>
            <motion.button
              onClick={() => router.push('/main/contact')}
              className="px-8 py-4 bg-gradient-to-r from-[#8B1538] to-[#D4AF37] text-white rounded-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Us Today
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}