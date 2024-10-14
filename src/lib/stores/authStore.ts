import {create, StateCreator} from 'zustand'
import {persist, createJSONStorage, PersistOptions} from "zustand/middleware";

export interface UserData {
    id: number;
    fullName: string;
    email: string;
    picture: string;
    description: string;
    badges: string[];
    points: number;
    role: string;
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

type AuthPersist = (
    config: StateCreator<AuthStore>,
    options: PersistOptions<AuthStore>
) => StateCreator<AuthStore>;

export const useAuthStore = create((persist as AuthPersist)((set) => ({
    isAuthenticated: false,
    user: null,
    refreshToken: null,
    accessToken: null,

    setAuthenticated: (isAuthenticated ) => set({ isAuthenticated }),
    setUser: (user) => set({ user }),
    setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
    clearAuth: () => set({
        isAuthenticated: false,
        user: null,
        refreshToken: null,
        accessToken: null
    }),
}),
    {
    name: 'game-storage',
    storage: createJSONStorage(() => localStorage),
}))