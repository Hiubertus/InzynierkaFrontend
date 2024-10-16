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
    achievementsVisible: boolean;
}

interface PersistedAuthStore {
    user: UserData | null;
    refreshToken: string | null;
    loading: boolean;
    setUser: (user: UserData | null) => void;
    setRefreshToken: (refreshToken: string | null) => void;
    updateUserField: <K extends keyof UserData>(field: K, value: UserData[K]) => void;
    clearPersistedAuth: () => void;
    setLoading: (loading: boolean) => void;
}

type PersistedAuthPersist = (
    config: StateCreator<PersistedAuthStore>,
    options: PersistOptions<PersistedAuthStore>
) => StateCreator<PersistedAuthStore>;

export const usePersistedAuthStore = create(
    (persist as PersistedAuthPersist)(
        (set) => ({
            user: null,
            refreshToken: null,
            loading: true, // Initially set to true
            setUser: (user) => set({ user }),
            setRefreshToken: (refreshToken) => set({ refreshToken }),
            updateUserField: (field, value) => set((state) => ({
                user: state.user ? { ...state.user, [field]: value } : null
            })),
            clearPersistedAuth: () => set({ user: null, refreshToken: null }),
            setLoading: (loading) => set({ loading }),
        }),
        {
            name: 'persisted-auth-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setLoading(false);
            },
        }
    )
)

interface AccessTokenStore {
    accessToken: string | null;
    setAccessToken: (accessToken: string | null) => void;
    clearAccessToken: () => void;
}

export const useAccessTokenStore = create<AccessTokenStore>((set) => ({
    accessToken: null,
    setAccessToken: (accessToken) => set({ accessToken }),
    clearAccessToken: () => set({ accessToken: null }),
}))

// Combined hook for easier access to both stores
export const useAuthStore = () => {
    const persistedAuth = usePersistedAuthStore()
    const accessToken = useAccessTokenStore()

    return {
        ...persistedAuth,
        ...accessToken,
        clearAuth: () => {
            persistedAuth.clearPersistedAuth()
            accessToken.clearAccessToken()
        },
    }
}