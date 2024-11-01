"use client"

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import { Session } from "@/lib/session/session";

type SessionContextType = {
    session: Session | null;
    updateSessionData: (newSession: Session) => void;
    clearSessionData: () => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({
                                    children,
                                    initialSession
                                }: {
    children: ReactNode;
    initialSession: Session | null;
}) {
    const [session, setSession] = useState<Session | null>(initialSession);
    useEffect(() => {
        function handleStorageChange(e: StorageEvent) {
            if (e.key === 'session_last_updated') {
                fetch('/api/session')
                    .then(res => res.json())
                    .then(newSession => {
                        setSession(newSession);
                    })
                    .catch(console.error);
            }
        }

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const updateSessionData = (newSession: Session) => {
        setSession(newSession);
    };

    const clearSessionData = useCallback(async () => {
        setSession(null);

        if (typeof window !== 'undefined') {
            localStorage.removeItem('session_last_updated');
        }
    }, []);

    return (
        <SessionContext.Provider value={{ session, updateSessionData, clearSessionData }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}