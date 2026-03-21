export interface QuotationItem {
    name: string;
    quantity: number;
    notes?: string;
    price?: number; // Added during billing
}

export interface Quotation {
    id: number;
    name?: string;
    email?: string;
    phone?: string;
    customer_notes?: string;
    
    // Properties used in admin quotations page
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    message?: string;
    item_details?: any[];

    // Relations
    user?: {
        id: string;
        name: string;
        email: string;
    };
    products?: any[]; // or define Product type
    items?: QuotationItem[]; // For the reply/quote itself? Or request items?
    status: string;
    total_amount?: number;
    created_at: string;
    updated_at: string;
}
