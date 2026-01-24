'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FolderPlus,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Package,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have utils
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isAdmin, isLoading } = useAuth();

    useEffect(() => {
        // Redirect to admin login if not authenticated, except when already on login page
        // Only redirect after initial load is complete
        if (!isLoading && !isAdmin && pathname !== '/admin/login') {
            router.push('/admin/login');
        }
    }, [isAdmin, isLoading, pathname, router]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
        { name: 'Quotation Requests', icon: FileText, href: '/admin/quotations' },
        { name: 'Projects Management', icon: FolderPlus, href: '/admin/projects' },
        { name: 'Products Management', icon: Package, href: '/admin/products' },
        { name: 'Customers Management', icon: Users, href: '/admin/customers' },
        { name: 'Settings', icon: Settings, href: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? '16rem' : '0rem',
                    x: isSidebarOpen ? 0 : -100,
                    opacity: isSidebarOpen ? 1 : 0
                }}
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-slate-200 overflow-hidden flex flex-col transition-all duration-300 shadow-xl lg:shadow-none",
                    !isSidebarOpen && "lg:w-0 lg:border-none"
                )}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 min-w-[16rem]">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">
                            SR
                        </div>
                        <span className="font-bold text-lg text-slate-800 tracking-tight">SkyRay Admin</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden text-slate-500 hover:text-slate-800">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="flex-1 p-4 space-y-1 min-w-[16rem] overflow-y-auto">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2 mt-2">
                        Main Menu
                    </div>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <span
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-full"
                                        />
                                    )}
                                    <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 min-w-[16rem]">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors group"
                    >
                        <LogOut className="h-5 w-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
                        Sign Out
                    </button>
                    <div className="mt-4 px-2 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                            {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900 leading-none">{user?.firstName} {user?.lastName}</span>
                            <span className="text-xs text-slate-500 mt-1 capitalize">{user?.role}</span>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50">
                {/* Top Header - Glass Effect */}
                <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-30
                    bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm transition-all duration-200">

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn("mr-2 hover:bg-slate-100", isSidebarOpen ? "lg:hidden" : "")}>
                            <Menu className="h-5 w-5 text-slate-600" />
                        </Button>
                        <h2 className="text-sm font-medium text-slate-500 lg:hidden">
                            Admin Dashboard
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Add header actions here later if needed (e.g. notifications bell) */}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
