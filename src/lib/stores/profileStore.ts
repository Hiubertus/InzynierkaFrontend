import { create } from 'zustand'
import { ProfileData } from '@/models/ProfileData'

interface ProfileStore {
    profiles: ProfileData[];
    isLoading: boolean;
    error: string | null;

    setProfiles: (profiles: ProfileData[]) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

const useProfileStore = create<ProfileStore>((set) => ({
    profiles: [],
    isLoading: false,
    error: null,

    setProfiles: (profiles) => set({ profiles }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

}))

export default useProfileStore