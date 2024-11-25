import { Coins } from 'lucide-react';

interface UserPointsProps {
    points: number;
}

export const PointsComponent = ({ points }: UserPointsProps) => {
    return (
        <div className="flex items-center bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full px-3 py-1 text-white shadow-sm hover:shadow-md transition-shadow">
            <Coins className="h-4 w-4 mr-1.5" />
            <span className="font-medium">{points}</span>
        </div>
    );
};