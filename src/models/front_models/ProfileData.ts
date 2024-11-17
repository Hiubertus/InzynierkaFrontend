export interface ProfileData {
    id: number;
    fullName: string;
    picture: File | null;
    description: string;
    badges: string[];
    badgesVisible: boolean;
    createdAt: Date;
}