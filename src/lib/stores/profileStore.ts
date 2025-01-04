import { create } from 'zustand'
import { ProfileData } from '@/models/front_models/ProfileData'
import { convertPictureToFile } from "@/lib/utils/conversionFunction";
import { fetchUserProfile } from "@/lib/session/userData/fetchUserProfile";
import { getBestTeachers } from "@/lib/session/userData/getBestTeachers";
import { useAuthStore } from "@/lib/stores/authStore";
import { UserDataGet } from "@/models/backend_models/UserDataGet";

interface ProfileStore {
    profiles: ProfileData[];
    bestTeacherIds: number[]; // Nowe pole dla ID najlepszych nauczycieli
    isLoading: boolean;
    error: string | null;

    setProfiles: (profiles: ProfileData[]) => void;
    addProfile: (profile: ProfileData) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;

    fetchProfile: (userId: number) => Promise<void>;
    fetchBestTeachers: () => Promise<void>;
    getBestTeacherProfiles: () => ProfileData[]; // Nowa metoda pomocnicza
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
    profiles: [],
    bestTeacherIds: [], // Inicjalizacja nowego pola
    isLoading: false,
    error: null,

    fetchBestTeachers: async () => {
        set({ isLoading: true, error: null });
        try {
            const authStore = useAuthStore.getState();
            const response = await getBestTeachers(authStore.accessToken);

            const teacherIds = response.teachers.map((teacher: UserDataGet) => teacher.id);
            set({ bestTeacherIds: teacherIds });

            for (const profile of response.teachers) {
                if (!get().profiles.some(p => p.id === profile.id)) {
                    get().addProfile({
                        id: profile.id,
                        fullName: profile.fullName,
                        picture: profile.picture ? convertPictureToFile(profile.picture.data, profile.picture.mimeType) : null,
                        description: profile.description,
                        badges: profile.badges || [],
                        badgesVisible: profile.badgesVisible,
                        createdAt: new Date(profile.createdAt),
                        roles: profile.roles,
                        review: profile.review ? profile.review : null,
                        reviewNumber: profile.reviewNumber ? profile.reviewNumber : null,
                        teacherProfileCreatedAt: profile.teacherProfileCreatedAt ? profile.teacherProfileCreatedAt : null
                    });
                }
            }
        } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to fetch best teachers' });
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    getBestTeacherProfiles: () => {
        const state = get();
        return state.bestTeacherIds
            .map(id => state.profiles.find(profile => profile.id === id))
            .filter((profile): profile is ProfileData => profile !== undefined);
    },

    fetchProfile: async (userId: number) => {
        set({ isLoading: true, error: null });
        try {
            const profileData = await fetchUserProfile(userId);
            const profile = profileData.profile;
            const newProfileData = {
                id: profile.id,
                fullName: profile.fullName,
                picture: profile.picture ? convertPictureToFile(profile.picture.data, profile.picture.mimeType) : null,
                description: profile.description,
                badges: profile.badges || [],
                badgesVisible: profile.badgesVisible,
                createdAt: new Date(profile.createdAt),
                roles: profile.roles,
                review: profile.review ? profile.review : null,
                reviewNumber: profile.reviewNumber ? profile.reviewNumber : null,
                teacherProfileCreatedAt: profile.teacherProfileCreatedAt ? profile.teacherProfileCreatedAt : null
            };

            set((state) => ({
                profiles: state.profiles.some(p => p.id === userId)
                    ? state.profiles.map(p => p.id === userId ? newProfileData : p)
                    : [...state.profiles, newProfileData]
            }));
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
}));