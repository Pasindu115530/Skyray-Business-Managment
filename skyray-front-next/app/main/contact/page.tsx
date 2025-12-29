"use client"; // Required for state management and framer-motion

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Standard Next.js framer-motion import
import { Mail, Phone, MapPin, Send, Clock, Check } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real application, you would send the data to a Next.js API route here
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 3000);
  };

  return (
    <div className="pt-20 bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-[#0a0a14] via-[#1a1a2e] to-[#0a0a14]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,21,56,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,21,56,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Mail className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl text-white mb-4">
              Get in <span className="bg-gradient-to-r from-[#8B1538] to-[#D4AF37] bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-gray-300">
              Have a question? We'd love to hear from you
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-3xl text-gray-900 mb-6">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm mb-2 text-gray-700">
                    Full Name *
                  </label>
                  <motion.input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    animate={{
                      boxShadow:
                        focusedField === 'name'
                          ? '0 0 0 3px rgba(139, 21, 56, 0.1), 0 0 20px rgba(212, 175, 55, 0.3)'
                          : '0 0 0 0px rgba(139, 21, 56, 0)',
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538] transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm mb-2 text-gray-700">
                    Email Address *
                  </label>
                  <motion.input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    animate={{
                      boxShadow:
                        focusedField === 'email'
                          ? '0 0 0 3px rgba(139, 21, 56, 0.1), 0 0 20px rgba(212, 175, 55, 0.3)'
                          : '0 0 0 0px rgba(139, 21, 56, 0)',
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538] transition-colors"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm mb-2 text-gray-700">
                    Phone Number
                  </label>
                  <motion.input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    animate={{
                      boxShadow:
                        focusedField === 'phone'
                          ? '0 0 0 3px rgba(139, 21, 56, 0.1), 0 0 20px rgba(212, 175, 55, 0.3)'
                          : '0 0 0 0px rgba(139, 21, 56, 0)',
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538] transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm mb-2 text-gray-700">
                    Subject *
                  </label>
                  <motion.input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('subject')}
                    onBlur={() => setFocusedField(null)}
                    animate={{
                      boxShadow:
                        focusedField === 'subject'
                          ? '0 0 0 3px rgba(139, 21, 56, 0.1), 0 0 20px rgba(212, 175, 55, 0.3)'
                          : '0 0 0 0px rgba(139, 21, 56, 0)',
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538] transition-colors"
                    placeholder="How can we help you?"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm mb-2 text-gray-700">
                    Message *
                  </label>
                  <motion.textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    animate={{
                      boxShadow:
                        focusedField === 'message'
                          ? '0 0 0 3px rgba(139, 21, 56, 0.1), 0 0 20px rgba(212, 175, 55, 0.3)'
                          : '0 0 0 0px rgba(139, 21, 56, 0)',
                    }}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8B1538] transition-colors resize-none"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="group relative w-full py-4 bg-gradient-to-r from-[#8B1538] to-[#D4AF37] text-white rounded-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#8B1538]"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative flex items-center justify-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </span>
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl text-gray-900 mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-8">
                  Feel free to reach out to us through any of the following channels. Our team is ready to assist you.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B1538] to-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-600">
                      No. 32,<br />
                      Attanagalla Road<br />
                      Veyangoda
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B1538] to-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600">
                      Main: +94 76 660 4800<br />
                      Support: +94 77 793 2376<br />
                     
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B1538] to-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600">
                      General: info@sreng.lk<br />
                      Sales: sales@sreng.lk<br />
                      Support: skyray@sreng.lk
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 10 }}
                  className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-md"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B1538] to-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 4:00 PM<br />
                      Sunday: Closed<br />
             
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
<section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative h-96 bg-gray-100 rounded-2xl overflow-hidden shadow-inner border border-gray-200"
    >
      {/* The iframe should be absolute inset-0 to fill the entire 
          motion.div container perfectly without showing gaps.
      */}
      <iframe
        title="Skyray Engineering Solutions Location"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126668.95243455091!2d79.97448669277954!3d7.194572397114055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2fd7e3aa20e45%3A0x467458d7e19ef2f4!2sSkyray%20Engineering%20Solutins%20(Pvt)%20Ltd.!5e0!3m2!1sen!2slk!4v1767013581615!5m2!1sen!2slk"
        className="absolute inset-0 w-full h-full"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </motion.div>
  </div>
</section>

      {/* Electric Pulse Divider */}
      <div className="relative h-1 bg-gradient-to-r from-transparent via-[#8B1538] to-transparent">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
          animate={{
            opacity: [0, 1, 0],
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  );
}
