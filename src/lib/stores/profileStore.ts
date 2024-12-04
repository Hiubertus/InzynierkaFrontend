import { create } from 'zustand'
import { ProfileData } from '@/models/front_models/ProfileData'
import {convertPictureToFile} from "@/lib/utils/conversionFunction";
import {fetchUserProfile} from "@/lib/session/userData/fetchUserProfile";

interface ProfileStore {
    profiles: ProfileData[];
    isLoading: boolean;
    error: string | null;

    setProfiles: (profiles: ProfileData[]) => void;
    addProfile: (profile: ProfileData) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;

    fetchProfile: (userId: number) => Promise<void>;
}

const useProfileStore = create<ProfileStore>((set, get) => ({
    profiles: [],
    isLoading: false,
    error: null,

    fetchProfile: async (userId: number) => {
        const existingProfile = get().profiles.find(profile => profile.id === userId);
        if (existingProfile) return;

        set({ isLoading: true, error: null });
        try {
            const profileData = await fetchUserProfile(userId);
            const profile = profileData.profile
            get().addProfile({
                id: profile.id,
                fullName: profile.fullName,
                picture: convertPictureToFile(profile.picture.data, profile.picture.mimeType),
                description: profile.description,
                badges: profile.badges || [],
                badgesVisible: profile.badgesVisible,
                createdAt: new Date(profile.createdAt),
                roles: profile.roles
            });
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch profile' });
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    setProfiles: (profiles) => set({ profiles }),
    addProfile: (profile) => set((state) => ({
        profiles: [...state.profiles, profile]
    })),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
}))

export default useProfileStore