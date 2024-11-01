import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Palette } from 'lucide-react';
import {cn} from "@/lib/utils";

interface ColorPickerProps {
    value: string;
    onChange: (color: string) => void;
    buttonClassName?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
                                                     value,
                                                     onChange,
                                                     buttonClassName
                                                 }) => {
    const presetColors = [
        { value: '#000000', label: 'Black' },
        { value: '#4A5568', label: 'Gray' },
        { value: '#E53E3E', label: 'Red' },
        { value: '#DD6B20', label: 'Orange' },
        { value: '#D69E2E', label: 'Yellow' },
        { value: '#38A169', label: 'Green' },
        { value: '#3182CE', label: 'Blue' },
        { value: '#805AD5', label: 'Purple' },
        { value: '#D53F8C', label: 'Pink' },
    ];

    const baseButtonClass = "p-2 border rounded flex items-center gap-1 transition-all duration-200 hover:bg-gray-100";

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(baseButtonClass, value !== '#000000' ? "bg-blue-100 border-blue-300 text-blue-600" : "", buttonClassName)}
                    title="Text Color"
                >
                    <Palette className="h-4 w-4" style={{ color: value }} />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
                <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                        {presetColors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => onChange(color.value)}
                                className={cn(
                                    "h-8 rounded-md border transition-all",
                                    value === color.value ? "ring-2 ring-blue-400" : "hover:scale-110"
                                )}
                                style={{ backgroundColor: color.value }}
                                title={color.label}
                            />
                        ))}
                    </div>
                    <div className="pt-2 border-t">
                        <label className="block text-sm text-gray-500 mb-2">Custom Color</label>
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full h-8 rounded cursor-pointer"
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ColorPicker;