import React from "react";
import {Trash2} from "lucide-react";

interface DeleteButtonProps {
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({onClick, className, disabled = false}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`
            text-white 
            transition-all 
            items-center 
            justify-center 
            px-2 
            flex
            ${disabled
            ? 'bg-red-300 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600'
        }
            ${className || ''}
        `}
        type="button"
    >
        <Trash2 size={20}/>
    </button>
);