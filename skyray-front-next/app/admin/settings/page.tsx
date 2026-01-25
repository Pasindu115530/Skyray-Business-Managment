'use client';

import React, { useState, useEffect } from 'react';
import { Save, User, Bell, Shield, Mail, Globe, Database, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { settingService } from '@/services/settingService';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        // Default values
        companyName: 'Skyray',
        siteName: 'Skyray Business',
        currency: 'LKR',
        timezone: 'Asia/Colombo',
        language: 'en',
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await settingService.getSettings();
            // Flatten the grouped settings for the form
            const flatSettings: any = {};
            Object.values(data).forEach((group: any) => {
                group.forEach((setting: any) => {
                    flatSettings[setting.key] = setting.value;
                });
            });
            setFormData(prev => ({ ...prev, ...flatSettings }));
        } catch (error) {
            console.error('Failed to load settings', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const checked = (e.target as any).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setLoading(true);

        try {
            // Convert form data back to array format expected by backend
            const settingsArray = Object.entries(formData).map(([key, value]) => ({
                key,
                value: String(value),
                group: 'general' // We can improve grouping logic here if needed
            }));

            await settingService.updateSettings(settingsArray);
            toast.success('Settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        Settings
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your application preferences and configuration.</p>
                </div>
                <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-600" />
                            <CardTitle>Profile Settings</CardTitle>
                        </div>
                        <CardDescription>Update your company profile information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Company Name</label>
                                <Input
                                    name="companyName"
                                    value={formData.companyName || ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter company name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                    placeholder="admin@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number</label>
                                <Input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleInputChange}
                                    placeholder="+94 77 123 4567"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Address</label>
                                <Input
                                    name="address"
                                    value={formData.address || ''}
                                    onChange={handleInputChange}
                                    placeholder="Enter address"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-gray-600" />
                            <CardTitle>General Settings</CardTitle>
                        </div>
                        <CardDescription>Configure basic site settings and preferences.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Site Name</label>
                                <Input
                                    name="siteName"
                                    value={formData.siteName || ''}
                                    onChange={handleInputChange}
                                    placeholder="Your site name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Site URL</label>
                                <Input
                                    type="url"
                                    name="siteUrl"
                                    value={formData.siteUrl || ''}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Currency</label>
                                <select
                                    name="currency"
                                    value={formData.currency || 'LKR'}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="EUR">EUR - Euro</option>
                                    <option value="GBP">GBP - British Pound</option>
                                    <option value="LKR">LKR - Sri Lankan Rupee</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Timezone</label>
                                <select
                                    name="timezone"
                                    value={formData.timezone || 'Asia/Colombo'}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Asia/Colombo">Asia/Colombo</option>
                                    <option value="America/New_York">America/New_York</option>
                                    <option value="Europe/London">Europe/London</option>
                                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
