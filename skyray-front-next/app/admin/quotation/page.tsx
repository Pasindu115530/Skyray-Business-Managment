'use client';

import { useState } from 'react';
import AdminNavigation from '@/app/components/AdminNavigation';

interface Quotation {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  service: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  createdAt: string;
}

// Fake quotations data
const fakeQuotations: Quotation[] = [
  { id: 1, customerName: 'John Doe', email: 'john@example.com', phone: '9876543210', service: 'Web Development', description: 'E-commerce website with payment integration', status: 'approved', amount: 150000, createdAt: '2026-01-10' },
  { id: 2, customerName: 'Jane Smith', email: 'jane@example.com', phone: '9876543211', service: 'Mobile App', description: 'iOS and Android app for delivery service', status: 'pending', amount: 250000, createdAt: '2026-01-09' },
  { id: 3, customerName: 'Mike Johnson', email: 'mike@example.com', phone: '9876543212', service: 'Digital Marketing', description: 'SEO and social media marketing campaign', status: 'approved', amount: 75000, createdAt: '2026-01-08' },
  { id: 4, customerName: 'Sarah Williams', email: 'sarah@example.com', phone: '9876543213', service: 'Cloud Services', description: 'AWS infrastructure setup and management', status: 'pending', amount: 120000, createdAt: '2026-01-07' },
  { id: 5, customerName: 'David Brown', email: 'david@example.com', phone: '9876543214', service: 'UI/UX Design', description: 'Complete redesign of corporate website', status: 'rejected', amount: 80000, createdAt: '2026-01-06' },
];

export default function AdminQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>(fakeQuotations);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const updateQuotationStatus = (id: number, status: 'approved' | 'rejected') => {
    setQuotations(quotations.map(q => q.id === id ? { ...q, status } : q));
    alert(`Quotation ${status}!`);
  };

  const deleteQuotation = (id: number) => {
    if (!confirm('Are you sure you want to delete this quotation?')) return;
    setQuotations(quotations.filter(q => q.id !== id));
    alert('Quotation deleted successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuotations = filter === 'all' 
    ? quotations 
    : quotations.filter(q => q.status === filter);

  const stats = {
    total: quotations.length,
    pending: quotations.filter(q => q.status === 'pending').length,
    approved: quotations.filter(q => q.status === 'approved').length,
    rejected: quotations.filter(q => q.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNavigation onLogout={() => console.log('Logout')} />

      {/* Main Content */}
      <div className="pt-20 md:pt-24 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Quotation Management</h1>
            <p className="text-gray-600 mt-2">Review and manage customer quotation requests</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <p className="text-sm font-medium text-gray-600">Total Quotations</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.approved}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.rejected}</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mb-6 flex gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'approved'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'rejected'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Rejected
            </button>
          </div>

          {/* Quotations Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuotations.length > 0 ? (
                    filteredQuotations.map((quotation) => (
                      <tr key={quotation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{quotation.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{quotation.customerName}</div>
                          <div className="text-sm text-gray-500">{quotation.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {quotation.phone}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{quotation.service}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{quotation.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{quotation.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(quotation.status)}`}>
                            {quotation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(quotation.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {quotation.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateQuotationStatus(quotation.id, 'approved')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateQuotationStatus(quotation.id, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteQuotation(quotation.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                        No quotations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
