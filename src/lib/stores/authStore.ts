import { create } from 'zustand'

interface AuthState {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    setAccessToken: (token) => {
        set({ accessToken: token });
        if (typeof window !== 'undefined') {
            localStorage.setItem('session_last_updated', Date.now().toString());
        }
    },
    clearAuth: () => {
        set({ accessToken: null });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('session_last_updated');
        }
    },
}));