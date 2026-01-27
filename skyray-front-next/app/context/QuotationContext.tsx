"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface QuotationItem {
    id: number;
    name: string;
    image_url: string | null;
    category: string;
    quantity: number;
}

interface QuotationContextType {
    items: QuotationItem[];
    addToQuote: (item: Omit<QuotationItem, 'quantity'>) => void;
    removeFromQuote: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearQuote: () => void;
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

export function QuotationProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<QuotationItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const addToQuote = (item: Omit<QuotationItem, 'quantity'>) => {
        setItems((prev) => {
            const existingItem = prev.find((i) => i.id === item.id);
            if (existingItem) {
                return prev.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setIsModalOpen(true);
    };

    const updateQuantity = (id: number, quantity: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    };

    const removeFromQuote = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearQuote = () => {
        setItems([]);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <QuotationContext.Provider
            value={{
                items,
                addToQuote,
                removeFromQuote,
                updateQuantity,
                clearQuote,
                isModalOpen,
                openModal,
                closeModal,
            }}
        >
            {children}
        </QuotationContext.Provider>
    );
}

export function useQuotation() {
    const context = useContext(QuotationContext);
    if (context === undefined) {
        throw new Error('useQuotation must be used within a QuotationProvider');
    }
    return context;
}
