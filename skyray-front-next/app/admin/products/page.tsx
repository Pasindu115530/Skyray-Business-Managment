'use client';

import { useState, useEffect } from 'react';
import AdminNavigation from '@/app/components/AdminNavigation';
import Image from 'next/image';

interface Product {
    id: number;
    category: string;
    name: string;
    description: string;
    image_url: string | null;
    specifications: string | null;
    created_at: string;
}

const CATEGORIES = [
    'Automation Equipment and Accessories',
    'Pneumatic and Hydraulic Fittings and Accessories',
    'Electrical Switchgears and Panel Accessories'
];

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // Form State
    const [formData, setFormData] = useState({
        category: CATEGORIES[0],
        name: '',
        description: '',
        specifications: '',
    });
    const [file, setFile] = useState<File | null>(null);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`);
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        const data = new FormData();
        data.append('category', formData.category);
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('specifications', formData.specifications);

        if (file) {
            data.append('image', file);
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                alert('Product added successfully!');
                setShowModal(false);
                // Reset form
                setFormData({
                    category: CATEGORIES[0],
                    name: '',
                    description: '',
                    specifications: '',
                });
                setFile(null);
                fetchProducts();
            } else {
                const errorData = await response.json();
                alert('Failed to add product: ' + JSON.stringify(errorData));
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('An error occurred while adding the product.');
        } finally {
            setUploading(false);
        }
    };

    const deleteProduct = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setProducts(products.filter(p => p.id !== id));
                alert('Product deleted successfully!');
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('An error occurred while deleting.');
        }
    };

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.category === selectedCategory);

    return (
        <div className="h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
            <AdminNavigation onLogout={() => console.log('Logout')} />

            {/* Main Content */}
            <div className="pt-20 md:pt-24 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                            <p className="text-gray-600 mt-2">Manage your product catalog</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
                        >
                            + Add New Product
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-8 flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('All')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'All'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            All
                        </button>
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="text-center py-12">Loading products...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                    {product.image_url && (
                                        <div className="relative h-48 mb-4 -mx-6 -mt-6">
                                            <Image
                                                src={product.image_url}
                                                alt={product.name}
                                                fill
                                                className="object-cover rounded-t-lg"
                                            />
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                                    <p className="text-blue-600 text-xs font-semibold mb-2 uppercase tracking-wide">{product.category}</p>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>

                                    {product.specifications && (
                                        <div className="mb-4 bg-gray-50 p-3 rounded text-xs text-gray-700 max-h-24 overflow-y-auto">
                                            <pre className="whitespace-pre-wrap font-sans">{product.specifications}</pre>
                                        </div>
                                    )}

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                                        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg transition duration-200 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredProducts.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-500">No products found in this category.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Product Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[200] overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">

                            {/* Header */}
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold leading-6 text-gray-900">Add New Product</h3>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="space-y-6">

                                        {/* Category Select */}
                                        <div>
                                            <label className="block text-sm font-medium leading-6 text-gray-900">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                                            >
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium leading-6 text-gray-900">Product Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                                placeholder="e.g. Industrial Air Compressor"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium leading-6 text-gray-900">Description</label>
                                            <textarea
                                                required
                                                rows={3}
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                                placeholder="Brief product description..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium leading-6 text-gray-900">
                                                Specifications / Dataset
                                                <span className="ml-1 text-xs text-gray-500 font-normal">(Enter technical details, features, or JSON data)</span>
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={formData.specifications}
                                                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                                                className="mt-2 block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 font-mono text-sm"
                                                placeholder={`Power: 500W\nVoltage: 220V\nWarranty: 2 Years`}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium leading-6 text-gray-900">Product Image</label>
                                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 hover:bg-gray-50 transition-colors">
                                                <div className="text-center">
                                                    {file ? (
                                                        <div className="text-sm text-gray-600">
                                                            <p className="font-semibold text-blue-600">{file.name}</p>
                                                            <button type="button" onClick={() => setFile(null)} className="text-red-500 underline mt-2 text-xs hover:text-red-700">Remove</button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                                            </svg>
                                                            <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                                                <label htmlFor="product-image-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                                                                    <span>Upload a file</span>
                                                                    <input
                                                                        id="product-image-upload"
                                                                        name="product-image-upload"
                                                                        type="file"
                                                                        accept="image/*"
                                                                        className="sr-only"
                                                                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                                                    />
                                                                </label>
                                                                <p className="pl-1">or drag and drop</p>
                                                            </div>
                                                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 5MB</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        {uploading ? 'Adding...' : 'Add Product'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
