import React, {useState} from "react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils/utils";
import {Button} from "@/components/ui/button";
import {Check, Pencil, X} from "lucide-react";

interface EditableFieldProps {
    value: string;
    onSave: (value: string) => void;
    fieldName: string;
    inputType: 'input' | 'textarea';
}

export const EditableField: React.FC<EditableFieldProps> = ({ value, onSave, inputType }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value);

    const handleSave = () => {
        onSave(editedValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedValue(value);
        setIsEditing(false);
    };

    const InputComponent = inputType === 'input' ? Input : Textarea;

    return (
        <div className="relative">
            <InputComponent
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                disabled={!isEditing}
                className={cn(
                    "w-full",
                    !isEditing && "cursor-default"
                )}
            />
            {!isEditing ? (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setIsEditing(true)}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            ) : (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex">
                    <Button variant="ghost" size="icon" onClick={handleSave}>
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};