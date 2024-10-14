import { create } from 'zustand'

export interface UserData {
    id: number;
    fullName: string;
    email: string;
    picture: string;
    description: string;
    badges: string[];
    achievementsVisible: boolean;
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
    updateUserField: <K extends keyof UserData>(field: K, value: UserData[K]) => void;

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
    updateUserField: (field, value) => set((state) => ({
        user: state.user ? { ...state.user, [field]: value } : null
    })),
}))