'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { notificationService } from '@/services/notificationService';
import { toast } from 'sonner';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            // Optimistically update
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read_at: new Date().toISOString() } : n
            ));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            toast.success('All marked as read');
        } catch (error) {
            console.error(error);
            toast.error('Failed to mark all as read');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        Notifications
                    </h1>
                    <p className="text-gray-500 mt-1">Stay updated with important alerts and messages.</p>
                </div>
                <Button variant="outline" className="gap-2" onClick={markAllRead}>
                    <Check className="h-4 w-4" />
                    Mark all as read
                </Button>
            </div>

            <Card className="min-h-[400px]">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <CardTitle>Recent Alerts</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">No notifications found</div>
                    ) : (
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 rounded-lg border transition-all ${!notification.read_at
                                            ? 'bg-blue-50 border-blue-100'
                                            : 'bg-white border-gray-100 hover:border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-full ${!notification.read_at ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                            <Bell className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className={`text-sm font-medium ${!notification.read_at ? 'text-gray-900' : 'text-gray-600'}`}>
                                                    {notification.data?.title || 'Notification'}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {new Date(notification.created_at).toLocaleDateString()}
                                                    </span>
                                                    {!notification.read_at && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                                            onClick={() => markAsRead(notification.id)}
                                                            title="Mark as read"
                                                        >
                                                            <Check className="h-3 w-3" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {notification.data?.message || JSON.stringify(notification.data)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
