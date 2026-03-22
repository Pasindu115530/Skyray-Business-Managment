'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    ShoppingBag,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    FileText,
    MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Firebase Imports
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState({
        total: 0,
        pending: 0,
        reviewed: 0,
        quoted: 0
    });
    const [recentRequests, setRecentRequests] = useState<any[]>([]);
    const { isAdmin, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // Admin නොවේ නම් Login පිටුවට යැවීම
        if (!isAdmin) {
            router.push('/admin/login');
            return;
        }

        // Firebase Real-time Listener එක ආරම්භ කිරීම
        const q = query(collection(db, "quotations"), orderBy("submittedAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            // 1. Stats ගණනය කිරීම
            const stats = {
                total: docs.length,
                pending: docs.filter((d: any) => d.status === 'pending').length,
                quoted: docs.filter((d: any) => d.status === 'replied').length,
                reviewed: docs.filter((d: any) => d.status === 'rejected').length,
            };
            setStatsData(stats);

            // 2. අලුත්ම Requests 5 ලබා ගැනීම
            const recent = docs.slice(0, 5).map((d: any) => ({
                id: d.id.substring(0, 6).toUpperCase(),
                customer: d.name || 'Guest',
                email: d.email,
                date: d.submittedAt?.toDate().toLocaleDateString() || 'N/A',
                status: mapStatus(d.status),
                amount: d.estimated_amount || '-'
            }));
            setRecentRequests(recent);
        }, (error) => {
            console.error("Dashboard Listener Error:", error);
        });

        // Component එක අයින් වන විට (unmount) listener එක නතර කිරීම
        return () => unsubscribe();
    }, [isAdmin, isLoading, router]);

    // Status එක UI එකට ගැලපෙන සේ මාරු කිරීම
    const mapStatus = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'replied': return 'Quoted';
            case 'pending': return 'Pending';
            case 'rejected': return 'Rejected';
            default: return 'Pending';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Quoted': return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-200/50';
            case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-200/50';
            case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-200/50';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const stats = [
        { label: 'Total Requests', value: statsData.total.toString(), icon: FileText, trend: 'up', color: 'indigo' },
        { label: 'Pending', value: statsData.pending.toString(), icon: Activity, trend: 'up', color: 'amber' },
        { label: 'Quoted', value: statsData.quoted.toString(), icon: ShoppingBag, trend: 'up', color: 'emerald' },
        { label: 'Rejected', value: statsData.reviewed.toString(), icon: Users, trend: 'down', color: 'rose' },
    ];

    return (
        <div className="space-y-8 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm">Real-time summary of your quotation requests.</p>
                </div>
                <Link href="/admin/quotations">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                        Manage Quotations
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="hover:shadow-md transition-all border-slate-100 group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className={`p-2.5 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-50 text-slate-600 flex items-center gap-1">
                                        Live <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                    </span>
                                </div>
                                <div className="mt-5">
                                    <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                                    <p className="text-sm text-slate-500 font-medium mt-1">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Recent Activity Table */}
            <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/50 p-6">
                    <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Recent Activity</CardTitle>
                        <CardDescription className="text-slate-500">Latest 5 quotation requests</CardDescription>
                    </div>
                    <Link href="/admin/quotations">
                        <Button variant="outline" size="sm">View All</Button>
                    </Link>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Ref ID</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Customer</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="py-4 px-6 text-sm font-mono text-indigo-600">#{req.id}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900">{req.customer}</span>
                                                <span className="text-xs text-slate-500">{req.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500">{req.date}</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(req.status)}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Link href="/admin/quotations">
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}