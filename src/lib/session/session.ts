'use server';

import { cookies } from 'next/headers';
import {decrypt, encrypt} from "@/lib/session/encrypt";

export type Session = {
    id: number;
    email: string;
    points: number;
    accessToken: string;
    refreshToken: string;
    fullName: string;
    picture: string;
    description: string;
    badges: string[];
    badgesVisible: boolean;
    role: 'USER' | 'VERIFIED' | 'TEACHER' | 'ADMIN'
};

export const getSession = async (): Promise<Session | null> => {
    const cookieStore = cookies();
    const session = cookieStore.get('session');

    if (session?.value) {
        try {
            const decrypted = decrypt(session.value);
            return JSON.parse(decrypted) as Session;
        } catch {
            return null
        }
    }

    return null;
};

export const setSession = async (session: Session) => {
    const cookieStore = cookies();
    const encrypted = encrypt(JSON.stringify(session));
    cookieStore.set('session', encrypted);
};

export const removeSession = async () => {
    const cookieStore = cookies();
    cookieStore.delete('session');
};
