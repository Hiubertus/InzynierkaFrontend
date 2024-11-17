import { create } from 'zustand'
import {convertPictureToFile} from "@/lib/utils/conversionFunction";


export type Roles = 'USER' | 'ADMIN' | 'VERIFIED' | 'TEACHER'

export interface UserData {
    id: number;
    email: string;
    points: number;
    fullName: string;
    picture: File | null;
    pictureBase64: string | null;
    mimeType: string | null;
    description: string;
    badges: string[];
    badgesVisible: boolean;
    roles: Roles[];
}

interface UserState {
    userData: UserData | null;
    isInitialized: boolean;
    setUserData: (data: Omit<UserData, 'picture'> & { picture?: File | null }) => void;
    updateUserField: <K extends keyof UserData>(field: K, value: UserData[K]) => void;
    clearUserData: () => void;
    setInitialized: (value: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
    userData: null,
    isInitialized: false,
    setUserData: (data) => {

        const pictureFile = data.pictureBase64 ?
            convertPictureToFile(data.pictureBase64, data.mimeType) :
            data.picture || null;

        const newUserData = {
            ...data,
            picture: pictureFile
        };

        set({ userData: newUserData });
    },
    updateUserField: (field, value) =>
        set((state) => {
            if (!state.userData) return { userData: null };

            const newUserData = { ...state.userData, [field]: value };

            if (field === 'pictureBase64' || field === 'mimeType') {
                newUserData.picture = convertPictureToFile(
                    newUserData.pictureBase64,
                    newUserData.mimeType
                );
            }
            return { userData: newUserData };
        }),
    clearUserData: () => set({ userData: null, isInitialized: false }),
    setInitialized: (value) => set({ isInitialized: value })
}));