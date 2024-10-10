import { create } from 'zustand'

export interface UserData {
    id: number;
    fullName: string;
    email: string;
    picture: string;
    description: string;
    badges: string[];
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
    // isAuthenticated: true,
    // user: {
    //     id: 1,
    //     fullName: "Jan Kowalski",
    //     email: "jan.kowalski@example.com",
    //     picture: "https://i.pravatar.cc/150?u=jan.kowalski@example.com",
    //     description: "Entuzjasta nowych technologii i miłośnik górskich wycieczek."
    // },
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