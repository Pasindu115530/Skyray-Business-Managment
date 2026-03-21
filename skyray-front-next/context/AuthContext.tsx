"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Firebase Imports
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export type UserRole = 'customer' | 'admin';

export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    token: string;
};

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    logout: () => void;
    isAdmin: boolean;
    isCustomer: boolean;
    setUserExternal: (user: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Firebase Auth Listener - මේක තමයි ලොග් වෙලාද නැද්ද කියලා හැමතිස්සෙම බලන්නේ
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            setIsLoading(true);
            if (firebaseUser) {
                // පාවිච්චි කරන කෙනාගේ විස්තර Firestore එකෙන් ලබා ගැනීම (ඔබේ User Role එක අනුව)
                // සටහන: Admin ලොග් වෙද්දී විතරක් නම් බලන්නේ, මෙතනට සරලව role: 'admin' දෙන්න පුළුවන්
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                const userData = userDoc.data();

                const token = await firebaseUser.getIdToken();

                setUser({
                    id: firebaseUser.uid,
                    email: firebaseUser.email || '',
                    firstName: userData?.firstName || 'Admin', // Firestore එකේ නැත්නම් default අගයක්
                    lastName: userData?.lastName || '',
                    role: (userData?.role as UserRole) || 'admin', // දැනට Admin ලෙස සලකමු
                    token: token,
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const isAdmin = user?.role === 'admin';
    const isCustomer = user?.role === 'customer';

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            logout,
            isAdmin,
            isCustomer,
            setUserExternal: setUser as any,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}