'use client';

import React, { useState, useEffect } from 'react';
import { Save, UserPlus, Mail, Phone, MapPin, Building, Search, User, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { customerService } from '@/services/customerService';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const data = await customerService.getCustomers();
            setCustomers(data);
        } catch (error) {
            console.log(error);
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await customerService.createCustomer(formData);
            toast.success('Customer created successfully');
            setFormData({ name: '', email: '', phone: '', address: '' });
            fetchCustomers();
        } catch (error) {
            console.log(error);
            toast.error('Failed to create customer');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            await customerService.deleteCustomer(id);
            toast.success('Customer deleted');
            fetchCustomers();
        } catch (error) {
            console.log(error);
            toast.error('Failed to delete customer');
        }
    }

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 tracking-tight">Customer Management</h1>
                    <p className="text-slate-500 mt-2 text-sm max-w-lg">Manage your client base and view their order history.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Column: Add Customer Form */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-slate-200 shadow-md sticky top-6">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2 text-indigo-700">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <UserPlus className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold tracking-tight">Add New Customer</h2>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Customer Name <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input name="name" value={formData.name} onChange={handleInputChange} className="pl-9" placeholder="John Doe" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Address <span className="text-rose-500">*</span></label>
                                    <div className="relative">
                                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input name="email" type="email" value={formData.email} onChange={handleInputChange} className="pl-9" placeholder="john@example.com" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="pl-9" placeholder="+94 ..." />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input name="address" value={formData.address} onChange={handleInputChange} className="pl-9" placeholder="Colombo, Sri Lanka" />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200" disabled={submitting}>
                                    {submitting ? 'Saving...' : 'Add Customer'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Customer List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-slate-200 shadow-sm bg-white">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="font-bold text-slate-800">Customer Directory</h3>
                                <p className="text-xs text-slate-500">View and manage existing customers</p>
                            </div>
                            <div className="relative w-full sm:w-72 group">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <Input
                                    placeholder="Search customers..."
                                    className="pl-9 bg-white border-slate-200 focus-visible:ring-indigo-500 transition-all shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Contact</th>
                                        <th className="px-6 py-4 font-medium">Orders</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan={4} className="text-center py-8 text-slate-500">Loading...</td></tr>
                                    ) : filteredCustomers.length === 0 ? (
                                        <tr><td colSpan={4} className="text-center py-8 text-slate-500">No customers found.</td></tr>
                                    ) : (
                                        filteredCustomers.map(customer => (
                                            <tr key={customer.id} className="bg-white hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-6 py-4 font-medium text-slate-900">{customer.name}</td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    <div>{customer.email}</div>
                                                    <div className="text-xs">{customer.phone}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                                                        {customer.orders_count || 0} Orders
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-rose-600" onClick={() => handleDelete(customer.id)}>
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
