import React, { useEffect, useState } from 'react';
import { useHistoryStore} from "@/lib/stores/historyStore";
import { HistoryCard } from './HistoryCard';
import PaginationControls from "@/components/Pagination/Pagination";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {Badge} from "@/components/ui/badge";
import {FaExclamation} from "react-icons/fa";

export const History: React.FC = () => {
    const { history, loading, error, fetchHistory } = useHistoryStore();
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        fetchHistory(currentPage);
    }, [currentPage, fetchHistory]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-full h-32" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <FaExclamation  className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!history) {
        return null;
    }

    const noTransactions = history.transactions.length === 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Transaction History</h2>
                <Badge variant="outline">
                    Total transactions: {history.totalItems}
                </Badge>
            </div>

            {noTransactions ? (
                <Alert>
                    <AlertTitle>No transactions</AlertTitle>
                    <AlertDescription>
                        You haven&#39;t made any transactions yet.
                    </AlertDescription>
                </Alert>
            ) : (
                <>
                    <div className="grid gap-4">
                        {history.transactions.map((transaction) => (
                            <HistoryCard key={transaction.id} transaction={transaction} />
                        ))}
                    </div>
                    <div className="mt-4">
                        <PaginationControls
                            currentPage={currentPage + 1}
                            totalPages={history.totalPages}
                            onPageChange={(page) => setCurrentPage(page - 1)}
                        />
                    </div>
                </>
            )}
        </div>
    );
};