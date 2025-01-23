import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Transaction} from "@/models/backend_models/historyBackendModel";
import { formatDate } from "@/lib/utils/formatDate";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface HistoryCardProps {
    transaction: Transaction;
}

export const HistoryCard: React.FC<HistoryCardProps> = ({ transaction }) => {
    const isPositive = transaction.pointsAmount > 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-lg font-medium">
                        {transaction.description}
                    </CardTitle>
                    <CardDescription>
                        {formatDate(new Date(transaction.transactionTime))}
                    </CardDescription>
                </div>
                <Badge variant={isPositive ? "default" : "destructive"} className="ml-2">
                    {isPositive ? <ArrowUpCircle className="mr-1 h-4 w-4" /> : <ArrowDownCircle className="mr-1 h-4 w-4" />}
                    {isPositive ? '+' : ''}{transaction.pointsAmount} points
                </Badge>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-muted-foreground">
                    Balance after: {transaction.balanceAfter} points
                </div>
            </CardContent>
        </Card>
    );
};