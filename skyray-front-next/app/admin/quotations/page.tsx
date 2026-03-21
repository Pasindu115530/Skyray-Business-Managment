'use client';

import React, { useState, useEffect } from 'react';
import { Search, Eye, MoreHorizontal, Filter, ArrowUpDown, FileText, Send, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { quotationService, Quotation } from '@/app/services/quotationService';
import { toast } from 'sonner';

export default function AdminQuotationsPage() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

    // modal states
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

    // reply state
    const [replyMessage, setReplyMessage] = useState('');
    const [replyPdfFile, setReplyPdfFile] = useState<File | null>(null);
    const [isReplying, setIsReplying] = useState(false);

    const fetchQuotations = async () => {
        setLoading(true);
        try {
            const data = await quotationService.getAll();
            setQuotations(data);
        } catch (error) {
            console.log(error);
            toast.error('Failed to load quotations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotations();
    }, []);

    const filteredQuotations = quotations.filter(q =>
        q.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'replied': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200';
            case 'pending': return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
            case 'rejected': return 'bg-rose-100 text-rose-700 hover:bg-rose-200';
            default: return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
        }
    };

    const handleReject = async (id: number) => {
        if (!confirm('Are you sure you want to reject this quotation? The customer will be informed.')) return;
        try {
            await quotationService.reject(id);
            toast.success('Quotation rejected successfully');
            fetchQuotations();
        } catch (error) {
            toast.error('Failed to reject quotation');
        }
    };

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedQuotation) return;
        if (!replyPdfFile && !replyMessage) {
            toast.error('Please provide a message or a PDF file to reply.');
            return;
        }

        setIsReplying(true);
        try {
            await quotationService.reply(selectedQuotation.id, replyMessage, replyPdfFile);
            toast.success('Quotation reply sent successfully');
            setIsReplyModalOpen(false);
            setReplyMessage('');
            setReplyPdfFile(null);
            fetchQuotations();
        } catch (error) {
            toast.error('Failed to send reply');
        } finally {
            setIsReplying(false);
        }
    };

    const openViewModal = (quotation: Quotation) => {
        setSelectedQuotation(quotation);
        setIsViewModalOpen(true);
    };

    const openReplyModal = (quotation: Quotation) => {
        setSelectedQuotation(quotation);
        setIsReplyModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 tracking-tight">Quotation Requests</h1>
                    <p className="text-slate-500 mt-2 text-sm max-w-lg">Manage quote requests, send PDF quotes, and reply to customers.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" /> Filter
                    </Button>
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm bg-white">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-indigo-700">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800">Recent Quotation Requests</h3>
                    </div>
                    <div className="relative w-full sm:w-72 group">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Search requests..."
                            className="pl-9 bg-white border-slate-200 focus-visible:ring-indigo-500 transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Ref #</th>
                                    <th className="px-6 py-4 font-medium">Customer</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                    <th className="px-6 py-4 font-medium">Items</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-slate-500">Loading quotations...</td>
                                    </tr>
                                ) : filteredQuotations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-8 text-slate-500">No quotation requests found.</td>
                                    </tr>
                                ) : (
                                    filteredQuotations.map((quotation) => (
                                        <tr key={quotation.id} className="bg-white hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-indigo-600">
                                                QT-{quotation.id.toString().padStart(4, '0')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">{quotation.customer_name}</div>
                                                <div className="text-xs text-slate-500">{quotation.customer_email}</div>
                                                {quotation.customer_phone && <div className="text-xs text-slate-400">{quotation.customer_phone}</div>}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(quotation.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {Array.isArray(quotation.item_details) ? quotation.item_details.length : 0} items
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={`${getStatusColor(quotation.status)} border-0 px-2 py-0.5 capitalize`}>
                                                    {quotation.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => openViewModal(quotation)}>
                                                            <Eye className="mr-2 h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        {quotation.status === 'pending' && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => openReplyModal(quotation)} className="text-emerald-600">
                                                                    <Send className="mr-2 h-4 w-4" /> Reply with Quote
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => handleReject(quotation.id)} className="text-rose-600">
                                                                    <XCircle className="mr-2 h-4 w-4" /> Reject Request
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>

            {/* View Details Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Quotation Request Details</DialogTitle>
                        <DialogDescription>
                            Review the items and messages requested by the customer.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedQuotation && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-slate-500 font-medium">Customer</p>
                                    <p className="font-bold text-slate-900">{selectedQuotation.customer_name}</p>
                                    <p className="text-slate-600">{selectedQuotation.customer_email}</p>
                                    <p className="text-slate-600">{selectedQuotation.customer_phone}</p>
                                </div>
                                <div className="text-right">
                                    <Badge className={`${getStatusColor(selectedQuotation.status)} border-0 capitalize mb-1`}>
                                        {selectedQuotation.status}
                                    </Badge>
                                    <p className="text-slate-500">Requested on: {new Date(selectedQuotation.created_at).toLocaleString()}</p>
                                </div>
                            </div>

                            {selectedQuotation.message && (
                                <div className="bg-slate-50 p-4 rounded-lg text-sm border border-slate-100">
                                    <p className="text-slate-500 font-medium mb-1">Customer Message</p>
                                    <p className="text-slate-700 whitespace-pre-wrap">{selectedQuotation.message}</p>
                                </div>
                            )}

                            <div>
                                <h4 className="font-semibold text-slate-900 mb-3 text-sm">Requested Items</h4>
                                <div className="border border-slate-200 rounded-lg overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                            <tr>
                                                <th className="px-4 py-2">Product Component</th>
                                                <th className="px-4 py-2">Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {selectedQuotation.item_details && Array.isArray(selectedQuotation.item_details) ? (
                                                selectedQuotation.item_details.map((item: any, idx: number) => (
                                                    <tr key={idx} className="bg-white">
                                                        <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                                                        <td className="px-4 py-3">{item.quantity}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={2} className="px-4 py-3 text-slate-500 text-center">No items listed.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Reply Modal */}
            <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reply to {selectedQuotation?.customer_name}</DialogTitle>
                        <DialogDescription>
                            Attach a PDF quotation and add an optional message to send to the customer.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleReplySubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Message (Optional)</label>
                            <textarea
                                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={4}
                                placeholder="Enter an optional message or leave blank for the default."
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                            ></textarea>
                            <p className="text-xs text-slate-500">If left blank, a default polite message will be sent.</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Attach PDF Quotation (Optional but recommended)</label>
                            <Input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setReplyPdfFile(e.target.files[0]);
                                    }
                                }}
                                className="w-full text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>
                        <DialogFooter className="mt-6 gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={() => setIsReplyModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isReplying}>
                                {isReplying ? 'Sending...' : 'Send Reply'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}
