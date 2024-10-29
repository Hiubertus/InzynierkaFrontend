import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface FormFieldProps<T extends FieldValues> {
    control: UseFormReturn<T>['control'];
    name: Path<T>;
    label: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
}

export const FormFieldInput = <T extends FieldValues>({
                                                          control,
                                                          name,
                                                          label,
                                                          type = "text",
                                                          placeholder = "",
                                                          disabled = false
                                                      }: FormFieldProps<T>) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className="col-span-2 md:col-span-1 relative">
                    <FormLabel className="text-sm md:text-base lg:text-lg">{label}</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            type={type}
                            placeholder={placeholder}
                            className={cn(
                                "text-sm md:text-base lg:text-lg p-2 md:p-3",
                                fieldState.error && "border-red-500 focus:ring-red-500"
                            )}
                            onFocus={() => setIsActive(true)}
                            onBlur={() => setIsActive(false)}
                            disabled={disabled}
                        />
                    </FormControl>
                    {fieldState.error && isActive && (
                        <div className="text-red-500 text-sm mt-1 absolute -bottom-[30px] left-0 right-0">
                            <div className="px-2 py-1 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
                                <div className="flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    <FormMessage/>
                                </div>
                            </div>
                        </div>
                    )}
                </FormItem>
            )}
        />
    );
};