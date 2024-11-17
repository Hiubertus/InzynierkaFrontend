import { create } from 'zustand'
import { ProfileData } from '@/models/front_models/ProfileData'

interface ProfileStore {
    profiles: ProfileData[];
    isLoading: boolean;
    error: string | null;

    setProfiles: (profiles: ProfileData[]) => void;
    addProfile: (profile: ProfileData) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

const useProfileStore = create<ProfileStore>((set) => ({
    profiles: [],
    isLoading: false,
    error: null,

    setProfiles: (profiles) => set({ profiles }),
    addProfile: (profile) => set((state) => ({
        profiles: [...state.profiles, profile]
    })),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
}))

export default useProfileStore