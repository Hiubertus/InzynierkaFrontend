
import { ChevronUp, ChevronDown } from 'lucide-react';
import {FC} from "react";

interface OrderButtonsProps {
    onMoveUp: () => void;
    onMoveDown: () => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
}

const OrderButtons: FC<OrderButtonsProps> = ({
                                                       onMoveUp,
                                                       onMoveDown,
                                                       canMoveUp,
                                                       canMoveDown,
                                                   }) => {
    const baseButtonClass = `
    p-0.5 
    rounded 
    transition-all 
    duration-200 
    flex 
    items-center 
    justify-center
    bg-gray-50
    border
    border-gray-200
    hover:bg-gray-100
    hover:border-gray-300
    active:bg-gray-200
  `;

    const disabledClass = "opacity-40 cursor-not-allowed hover:bg-gray-50 hover:border-gray-200";

    return (
        <div className="flex flex-col gap-0.5 justify-center mr-2 p-0.5 rounded bg-gray-100/50">
            <button
                onClick={onMoveUp}
                disabled={!canMoveUp}
                className={`${baseButtonClass} ${!canMoveUp ? disabledClass : ''}`}
                type="button"
                title="Move Up"
            >
                <ChevronUp size={14} className={canMoveUp ? "text-gray-700" : "text-gray-400"} />
            </button>
            <button
                onClick={onMoveDown}
                disabled={!canMoveDown}
                className={`${baseButtonClass} ${!canMoveDown ? disabledClass : ''}`}
                type="button"
                title="Move Down"
            >
                <ChevronDown size={14} className={canMoveDown ? "text-gray-700" : "text-gray-400"} />
            </button>
        </div>
    );
};

export default OrderButtons;