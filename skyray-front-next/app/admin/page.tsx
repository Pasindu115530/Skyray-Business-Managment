'use client';
import React, { useState, useEffect } from 'react';
import { quotationService } from '@/services/quotationService';
import { motion } from 'framer-motion';
import {
    Users,
    DollarSign,
    ShoppingBag,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    MoreHorizontal,
    FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [statsData, setStatsData] = useState({
        total: 0,
        pending: 0,
        reviewed: 0,
        quoted: 0
    });
    const [recentRequests, setRecentRequests] = useState<any[]>([]);
    const { user, isAdmin, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // Redirect to admin login if not authenticated as admin
        if (!isAdmin) {
            router.push('/admin/login');
            return;
        }
        fetchDashboardData();
    }, [isAdmin, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const fetchDashboardData = async () => {
        try {
            // Import dynamically to avoid circular deps if any, or just standard import
            const { dashboardService } = await import('@/services/dashboardService');
            const data = await dashboardService.getStats();
            setStatsData(data.stats);
            setRecentRequests(data.recent_requests);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        }
    };

    const stats = [
        { label: 'Quotation Requests', value: statsData.total.toString(), change: '+12%', icon: FileText, trend: 'up' },
        { label: 'Pending Requests', value: statsData.pending.toString(), change: '+5%', icon: Activity, trend: 'up' },
        { label: 'Quoted', value: statsData.quoted.toString(), change: '+8%', icon: ShoppingBag, trend: 'up' },
        { label: 'Under Review', value: statsData.reviewed.toString(), change: '-2%', icon: Users, trend: 'down' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Quoted': return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-200/50';
            case 'Reviewed': return 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-200/50';
            case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-200/50';
            case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-200/50';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 tracking-tight">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm max-w-lg">
                        Welcome back! Here's a summary of your recent quotation activity and performance metrics.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/quotations">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all">
                            View All Quotations
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="hover:shadow-lg transition-all duration-300 border-slate-100 overflow-hidden group">
                            <CardContent className="p-6 relative">
                                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110">
                                    <stat.icon className="w-24 h-24" />
                                </div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div className={`p-2.5 rounded-xl ${stat.trend === 'up' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'} transition-colors`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'}`}>
                                        {stat.change}
                                        {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    </span>
                                </div>
                                <div className="mt-5 relative z-10">
                                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                                    <p className="text-sm text-slate-500 font-medium mt-1">{stat.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/50 p-6">
                    <div>
                        <CardTitle className="text-lg font-semibold text-slate-800">Recent Activity</CardTitle>
                        <CardDescription className="text-slate-500 mt-1">Latest quotation requests from potential clients</CardDescription>
                    </div>
                    <Link href="/admin/quotations">
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            View All
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100 text-left">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference ID</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer Details</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date Received</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Status</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Est. Amount</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="py-4 px-6 text-sm font-medium text-indigo-600 font-mono">#{req.id}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold shadow-sm ring-2 ring-white">
                                                    {req.customer ? req.customer.charAt(0).toUpperCase() : 'G'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900">{req.customer || 'Guest User'}</span>
                                                    <span className="text-xs text-slate-500">{req.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500 whitespace-nowrap">{req.date}</td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ring-1 ring-inset ${getStatusColor(req.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${req.status === 'Quoted' ? 'bg-emerald-500' :
                                                    req.status === 'Pending' ? 'bg-amber-500' :
                                                        req.status === 'Reviewed' ? 'bg-sky-500' : 'bg-rose-500'
                                                    }`}></span>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-700 text-right font-medium font-mono">
                                            {req.amount !== '-' ? `$${req.amount}` : <span className="text-slate-400">—</span>}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <Link href={`/admin/quotations`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors opacity-0 group-hover:opacity-100">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {recentRequests.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400 italic">
                                            No quotation requests found in the recent period.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
