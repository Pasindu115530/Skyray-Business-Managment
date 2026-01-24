'use client';

import { Fragment, ReactNode } from 'react';

interface SlideOverProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
}

export default function SlideOver({ isOpen, onClose, title, description, children, footer }: SlideOverProps) {
    if (!isOpen) return null;

    return (
        <div className="relative z-50" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            {/* Background backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity ease-in-out duration-300"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        {/* Slide-over panel */}
                        <div className={`pointer-events-auto w-screen max-w-md transform transition ease-in-out duration-500 sm:duration-700 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">

                                {/* Header */}
                                <div className="px-6 py-6 sm:px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold leading-6 text-gray-900" id="slide-over-title">
                                                {title}
                                            </h2>
                                            {description && (
                                                <p className="mt-1 text-sm text-gray-500">{description}</p>
                                            )}
                                        </div>
                                        <div className="ml-3 flex h-7 items-center">
                                            <button
                                                type="button"
                                                className="relative rounded-full bg-white text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all p-1"
                                                onClick={onClose}
                                            >
                                                <span className="absolute -inset-2.5" />
                                                <span className="sr-only">Close panel</span>
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="relative flex-1 px-6 py-6 sm:px-8">
                                    {children}
                                </div>

                                {/* Footer */}
                                {footer && (
                                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 sm:px-8 shrink-0">
                                        {footer}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
