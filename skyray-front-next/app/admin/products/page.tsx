'use client';

import React, { useState, useEffect } from 'react';
import { Save, Package, Tag, DollarSign, Package2, Image as ImageIcon, Grid3x3, Upload, FileText, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import ProductsTable from '@/components/admin/products-table';
import { productService } from '@/services/productService';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Form State
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [datasheetFile, setDatasheetFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    sku: '',
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      // Use service with search
      const data = await productService.getProducts(debouncedSearch);
      setProducts(data || []);
      console.log(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error('Failed to load products');
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    setTableLoading(true);
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...newFiles]);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDatasheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDatasheetFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.name || !formData.price || !formData.category || !formData.stock) {
        setError('Please fill in all required fields');
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('stock', formData.stock);
      data.append('sku', formData.sku);

      // Append images
      if (imageFiles.length > 0) {
        data.append('image', imageFiles[0]);
      }
      // Keep sending images[] if needed for future multiple image support, 
      // but 'image' is required for current backend logic.
      imageFiles.forEach((file) => {
        data.append('images[]', file);
      });

      // Append datasheet
      if (datasheetFile) {
        data.append('datasheet', datasheetFile);
      }

      await api.post('/api/products', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Product created successfully');
      router.refresh();

      // Reset Form
      setFormData({
        name: '', description: '', price: '', category: '', stock: '', sku: ''
      });
      setImageFiles([]);
      setImagePreviews([]);
      setDatasheetFile(null);

      fetchProducts(); // Refresh table
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'An error occurred';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 tracking-tight">Product Management</h1>
          <p className="text-slate-500 mt-2 text-sm max-w-lg">Create, organize, and manage your product catalog efficiently.</p>
        </div>
        <div className="flex gap-2">
          {/* Add any page-level actions here if needed */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Add Product Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-md sticky top-6">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-indigo-700">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Package2 className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold tracking-tight">Add New Product</h2>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-slate-200"></span> Basic Info <span className="flex-1 h-[1px] bg-slate-200"></span>
                  </h3>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Product Name <span className="text-rose-500">*</span></label>
                    <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Industrial Controller X200" required className="focus-visible:ring-indigo-500" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed product specifications..."
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-slate-200"></span> Details <span className="flex-1 h-[1px] bg-slate-200"></span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Price <span className="text-rose-500">*</span></label>
                      <div className="relative group">
                        <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <Input className="pl-9 focus-visible:ring-indigo-500" type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Stock <span className="text-rose-500">*</span></label>
                      <Input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="Qty" required className="focus-visible:ring-indigo-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Category <span className="text-rose-500">*</span></label>
                    <div className="relative group">
                      <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all pl-9"
                        required
                      >
                        <option value="" disabled>Select Category</option>
                        <option value="automation-equipment">Automation Equipment and Accessories</option>
                        <option value="pneumatic-hydraulic">Pneumatic and Hydraulic Fittings and Accessories</option>
                        <option value="electrical-switchgears">Electrical Switchgears and Panel Accessories</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">SKU / Model</label>
                    <Input name="sku" value={formData.sku} onChange={handleInputChange} placeholder="Unique identifier (Optional)" className="focus-visible:ring-indigo-500" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-8 h-[1px] bg-slate-200"></span> Assets <span className="flex-1 h-[1px] bg-slate-200"></span>
                  </h3>
                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Images</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 hover:bg-slate-50 hover:border-indigo-400 transition-all text-center cursor-pointer relative group">
                      <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                          <Upload className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-700">Click to upload</span>
                          <span className="text-sm text-slate-500"> or drag and drop</span>
                        </div>
                        <span className="text-xs text-slate-400">PNG, JPG up to 5MB</span>
                      </div>
                    </div>
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-3">
                        {imagePreviews.map((src, idx) => (
                          <div key={idx} className="relative aspect-square border border-slate-200 rounded-md overflow-hidden group shadow-sm bg-white">
                            <img src={src} alt="preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-rose-600"
                            >
                              <span className="sr-only">Remove</span>
                              <div className="w-3 h-3 flex items-center justify-center font-bold leading-none">×</div>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Datasheet Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Datasheet (PDF)</label>
                    <div className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${datasheetFile ? 'bg-indigo-50 border-indigo-200' : 'border-slate-200 bg-white'}`}>
                      <div className={`p-2 rounded-lg ${datasheetFile ? 'bg-white' : 'bg-slate-100'}`}>
                        <FileText className={`w-5 h-5 ${datasheetFile ? 'text-indigo-600' : 'text-slate-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        {datasheetFile ? (
                          <div className="text-sm font-medium text-indigo-900 truncate">{datasheetFile.name}</div>
                        ) : (
                          <div className="text-sm text-slate-500">No file selected</div>
                        )}
                      </div>
                      <div className="relative">
                        <Input type="file" accept="application/pdf" onChange={handleDatasheetChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <Button type="button" variant="outline" size="sm" className="pointer-events-none">Browse</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all h-11" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving Product...
                    </div>
                  ) : 'Create Product'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Product List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-800">Product Catalog</h3>
                <p className="text-xs text-slate-500">Manage existing inventory</p>
              </div>
              <div className="relative w-full sm:w-72 group">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  placeholder="Search by name, SKU or category..."
                  className="pl-9 bg-white border-slate-200 focus-visible:ring-indigo-500 transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="p-0">
              <ProductsTable products={products} onRefresh={fetchProducts} isLoading={tableLoading} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
