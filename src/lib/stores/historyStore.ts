import {Transaction} from "@/models/backend_models/historyBackendModel";



import { create } from 'zustand';
import {getHistory} from "@/lib/history/getHistory";
import {useAuthStore} from "@/lib/stores/authStore";

export interface TransactionHistory {
    totalPages: number;
    totalItems: number;
    currentPage: number;
    transactions: Transaction[];

}

interface HistoryState {
    history: TransactionHistory | null;
    loading: boolean;
    error: string | null;
    fetchHistory: (page: number, size?: number) => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set) => ({
    history: null,
    loading: false,
    error: null,
    fetchHistory: async (page: number, size: number = 5) => {
        try {
            set({ loading: true, error: null });
            const accessToken = useAuthStore.getState().accessToken;
            const response = await getHistory(accessToken!, page, size);
            set({ history: response, loading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch history',
                loading: false
            });
        }
    },
}));
