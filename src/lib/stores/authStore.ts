import { create } from 'zustand'

interface UserData {
    id: string;
    fullName: string;
    email: string;
    picture: string;
    description: string;
}

interface AuthStore {
    isAuthenticated: boolean;
    user: UserData | null;
    refreshToken: string | null;
    accessToken: string | null;

    setAuthenticated: (status: boolean) => void;
    setUser: (user: UserData | null) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isAuthenticated: false,
    user: null,
    refreshToken: null,
    accessToken: null,

    setAuthenticated: (status) => set({ isAuthenticated: status }),
    setUser: (user) => set({ user }),
    setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
    clearAuth: () => set({
        isAuthenticated: false,
        user: null,
        refreshToken: null,
        accessToken: null
    }),
}))