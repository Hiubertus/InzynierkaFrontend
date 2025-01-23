export interface Transaction {
    id: number;
    transactionTime: string;
    transactionType: 'POINTS_WITHDRAWAL' | 'POINTS_PURCHASE';
    pointsAmount: number;
    description: string;
    balanceAfter: number;
    relatedEntityId: number | null;
    relatedEntityType: string | null;
}