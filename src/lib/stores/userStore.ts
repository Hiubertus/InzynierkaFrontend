import { create } from 'zustand'
import {convertPictureToFile} from "@/lib/utils/conversionFunction";

export interface UserData {
    id: number;
    email: string;
    points: number;
    fullName: string;
    picture: File | null;
    pictureBase64: string | null;
    pictureType: string | null;
    description: string;
    badges: string[];
    badgesVisible: boolean;
    role: 'USER' | 'VERIFIED' | 'TEACHER' | 'ADMIN';
}

interface UserState {
    userData: UserData | null;
    setUserData: (data: Omit<UserData, 'picture'> & { picture?: File | null }) => void;
    updateUserField: <K extends keyof UserData>(field: K, value: UserData[K]) => void;
    clearUserData: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    userData: null,
    setUserData: (data) => {

        const pictureFile = data.pictureBase64 ?
            convertPictureToFile(data.pictureBase64, data.pictureType) :
            data.picture || null;

        const newUserData = {
            ...data,
            picture: pictureFile
        };

        set({ userData: newUserData });
        if (typeof window !== 'undefined') {
            localStorage.setItem('session_last_updated', Date.now().toString());
        }
    },
    updateUserField: (field, value) =>
        set((state) => {
            if (!state.userData) return { userData: null };

            const newUserData = { ...state.userData, [field]: value };

            if (field === 'pictureBase64' || field === 'pictureType') {
                newUserData.picture = convertPictureToFile(
                    newUserData.pictureBase64,
                    newUserData.pictureType
                );
            }

            if (typeof window !== 'undefined') {
                localStorage.setItem('session_last_updated', Date.now().toString());
            }
            return { userData: newUserData };
        }),
    clearUserData: () => set({ userData: null }),
}));