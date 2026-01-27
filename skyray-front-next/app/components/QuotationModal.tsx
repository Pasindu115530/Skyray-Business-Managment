"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Send, ShoppingBag, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import { useQuotation } from '../context/QuotationContext';

export default function QuotationModal() {
    const { isModalOpen, closeModal, items, removeFromQuote, updateQuantity, clearQuote } = useQuotation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("Submitting Quote Request:", {
            contact: formData,
            items: items
        });

        setIsSubmitting(false);
        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
            clearQuote();
            closeModal();
            setFormData({ fullName: '', email: '', phone: '', message: '' });
        }, 2000);
    };

    if (!isModalOpen) return null;

    return (
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {showSuccess ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Send className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Request Sent!</h3>
                                <p className="text-gray-500">We have received your quotation request and will get back to you shortly.</p>
                            </div>
                        ) : (
                            <>
                                {/* Left Side: Form */}
                                <div className="w-full md:w-1/2 p-8 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Quotation</h2>
                                    <p className="text-gray-500 text-sm mb-8">Fill in your details and we'll get back to you with a formal quote.</p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={4}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                                placeholder="Any specific requirements or questions?"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={items.length === 0 || isSubmitting}
                                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                        >
                                            {isSubmitting ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    <span>Send Request</span>
                                                </>
                                            )}
                                        </button>
                                        {items.length === 0 && <p className="text-xs text-red-500 text-center mt-2">Please add items to quote before sending.</p>}
                                    </form>
                                </div>

                                {/* Right Side: Items List */}
                                <div className="w-full md:w-1/2 p-8 bg-gray-50 overflow-y-auto">
                                    <div className="flex items-center space-x-2 mb-6">
                                        <ShoppingBag className="w-5 h-5 text-blue-600" />
                                        <h3 className="font-semibold text-gray-900">Items in your list ({items.length})</h3>
                                    </div>

                                    {items.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                            <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                                            <p>Your list is empty</p>
                                            <button onClick={closeModal} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                                                Browse Products
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {items.map((item) => (
                                                <motion.div
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    key={item.id}
                                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 group"
                                                >
                                                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                        {item.image_url ? (
                                                            <Image
                                                                src={item.image_url.startsWith('http') ? item.image_url : `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}${item.image_url.startsWith('/') ? '' : '/'}${item.image_url}`}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-center h-full text-xs text-gray-400">No Img</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium text-gray-900 truncate" title={item.name}>{item.name}</h4>
                                                        <div className="flex items-center space-x-3 mt-2">
                                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    className="p-1 hover:bg-gray-100 text-gray-500 rounded-l-lg"
                                                                >
                                                                    <Minus className="w-3 h-3" />
                                                                </button>
                                                                <span className="px-2 text-sm font-medium text-gray-700 w-8 text-center">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="p-1 hover:bg-gray-100 text-gray-500 rounded-r-lg"
                                                                >
                                                                    <Plus className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromQuote(item.id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
