'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminSettings() {
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@skyray.com',
    phone: '+91 9876543210'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailQuotations: true,
    emailCustomers: true,
    weeklySummary: false,
    projectUpdates: true
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password updated successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Notification preferences saved!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white text-2xl font-bold">Skyray Admin</h1>
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/main/admin"
                  className="text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/main/admin/projects"
                  className="text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Projects
                </Link>
                <Link
                  href="/main/admin/customers"
                  className="text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Customers
                </Link>
                <Link
                  href="/main/admin/gallery"
                  className="text-blue-100 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Gallery Photos
                </Link>
                <Link
                  href="/main/admin/settings"
                  className="bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Settings
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your admin preferences and configurations</p>
          </div>

          <div className="space-y-6">
            {/* Profile Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Admin Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin@skyray.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>

            {/* Password Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Update Password
                </button>
              </form>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
              <form onSubmit={handleNotificationsSubmit} className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.emailQuotations}
                    onChange={(e) => setNotifications({ ...notifications, emailQuotations: e.target.checked })}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email notifications for new quotations</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.emailCustomers}
                    onChange={(e) => setNotifications({ ...notifications, emailCustomers: e.target.checked })}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email notifications for new customers</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.weeklySummary}
                    onChange={(e) => setNotifications({ ...notifications, weeklySummary: e.target.checked })}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">Weekly summary reports</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifications.projectUpdates}
                    onChange={(e) => setNotifications({ ...notifications, projectUpdates: e.target.checked })}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">Project status updates</span>
                </label>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg mt-4"
                >
                  Save Notification Preferences
                </button>
              </form>
            </div>

            {/* System Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Settings</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Database Status</p>
                    <p className="text-sm text-gray-600">Check database connection</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Connected
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">API Version</p>
                    <p className="text-sm text-gray-600">Current API version</p>
                  </div>
                  <span className="text-gray-900 font-semibold">v1.0.0</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-medium text-gray-900">Clear Cache</p>
                    <p className="text-sm text-gray-600">Clear application cache</p>
                  </div>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200">
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
