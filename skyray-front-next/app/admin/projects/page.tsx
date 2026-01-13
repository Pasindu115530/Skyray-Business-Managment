'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNavigation from '@/app/components/AdminNavigation';

interface Project {
  id: number;
  title: string;
  description: string;
  clientName: string;
  status: string;
  startDate: string;
  budget: number;
  createdAt: string;
}

// Fake projects data
const fakeProjects: Project[] = [
  { id: 1, title: 'E-commerce Website', description: 'Full-stack online shopping platform with payment integration', clientName: 'ABC Store', status: 'in-progress', startDate: '2026-01-01', budget: 250000, createdAt: '2026-01-01' },
  { id: 2, title: 'Mobile Banking App', description: 'Secure iOS and Android banking application', clientName: 'XYZ Bank', status: 'planning', startDate: '2026-02-01', budget: 500000, createdAt: '2026-01-05' },
  { id: 3, title: 'Company Website Redesign', description: 'Modern responsive website with CMS', clientName: 'Tech Corp', status: 'completed', startDate: '2025-12-01', budget: 150000, createdAt: '2025-12-01' },
  { id: 4, title: 'Inventory Management System', description: 'Cloud-based inventory tracking solution', clientName: 'Retail Plus', status: 'in-progress', startDate: '2026-01-10', budget: 300000, createdAt: '2026-01-10' },
  { id: 5, title: 'Social Media Platform', description: 'Community-focused social networking app', clientName: 'SocialHub', status: 'on-hold', startDate: '2025-11-15', budget: 450000, createdAt: '2025-11-15' },
  { id: 6, title: 'Learning Management System', description: 'Online education platform with video courses', clientName: 'EduTech', status: 'in-progress', startDate: '2026-01-05', budget: 350000, createdAt: '2026-01-05' },
];

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>(fakeProjects);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientName: '',
    status: 'planning',
    startDate: '',
    budget: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: projects.length + 1,
      title: formData.title,
      description: formData.description,
      clientName: formData.clientName,
      status: formData.status,
      startDate: formData.startDate,
      budget: parseFloat(formData.budget),
      createdAt: new Date().toISOString()
    };
    setProjects([newProject, ...projects]);
    setShowModal(false);
    setFormData({
      title: '',
      description: '',
      clientName: '',
      status: 'planning',
      startDate: '',
      budget: ''
    });
    alert('Project added successfully!');
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setProjects(projects.filter(p => p.id !== id));
    alert('Project deleted successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminNavigation onLogout={() => console.log('Logout')} />

      {/* Main Content */}
      <div className="pt-20 md:pt-24 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
              <p className="text-gray-600 mt-2">Add and manage projects</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200"
            >
              + Add New Project
            </button>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {project.clientName}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(project.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm font-semibold text-blue-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ₹{project.budget.toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                >
                  Delete Project
                </button>
              </div>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects found. Add your first project!</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Project</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter client name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="planning">Planning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter budget amount"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                  >
                    Add Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition duration-200"
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
