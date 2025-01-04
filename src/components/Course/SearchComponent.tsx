import React, { useState, useEffect } from 'react';
import { Search } from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useCourseStore } from '@/lib/stores/courseStore';

interface SearchComponentProps {
    onSearch: (search: string, tag: string | undefined) => void;
}

export const SearchComponent = ({ onSearch }: SearchComponentProps) => {
    const [localSearch, setLocalSearch] = useState('');
    const [localTag, setLocalTag] = useState<string | undefined>(undefined);
    const {
        availableTags,
        fetchTags
    } = useCourseStore();

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    const handleSubmit = () => {
        onSearch(localSearch, localTag);
    };

    const handleClear = () => {
        setLocalSearch('');
        setLocalTag(undefined);
        onSearch('', undefined);
    };

    return (
        <div className="space-y-4 mb-6">
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search courses..."
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button
                    onClick={handleSubmit}
                    className="px-4"
                >
                    Search
                </Button>
                {(localSearch || localTag) && (
                    <Button
                        variant="outline"
                        onClick={handleClear}
                        className="px-3"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Search available tags..." />
                <CommandList>
                    <CommandEmpty>No tags found.</CommandEmpty>
                    <CommandGroup heading="Available Tags">
                        <CommandItem>Test</CommandItem>
                        {availableTags?.map((tag) => (
                            <CommandItem
                                key={tag}
                                onSelect={() => setLocalTag(tag === localTag ? undefined : tag)}
                                className="cursor-pointer"
                            >
                                <span className={tag === localTag ? "font-bold" : ""}>
                                    {tag}
                                </span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>

            </Command>

            {localTag && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Selected tag:</span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                        {localTag}
                    </span>
                </div>
            )}
        </div>
    );
};