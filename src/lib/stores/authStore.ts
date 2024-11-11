import { create } from 'zustand'

interface AuthState {
    accessToken: string | null;
    isInitialized: boolean;
    setAccessToken: (token: string | null) => void;
    clearAuth: () => void;
    setInitialized: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    isInitialized: false,
    setAccessToken: (token) => set({ accessToken: token }),
    clearAuth: () => set({ accessToken: null, isInitialized: false }),
    setInitialized: (value) => set({ isInitialized: value }),
}));