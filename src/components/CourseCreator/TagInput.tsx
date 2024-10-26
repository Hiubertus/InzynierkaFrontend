import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CourseForm } from "./formSchema";

interface TagInputProps {
    form: UseFormReturn<CourseForm>;
}

export const TagInput: React.FC<TagInputProps> = ({ form }) => {
    const [tagInput, setTagInput] = React.useState("");
    const tags = form.watch('tags');

    const handleAddTag = () => {
        const newTag = tagInput.trim();
        if (newTag && !tags.includes(newTag)) {
            form.setValue('tags', [...tags, newTag], {
                shouldValidate: true
            });
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        form.setValue(
            'tags',
            tags.filter((tag) => tag !== tagToRemove),
            { shouldValidate: true }
        );
    };

    return (
        <FormField
            control={form.control}
            name="tags"
            render={() => (
                <FormItem>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <FormControl>
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Enter a tag"
                                />
                            </FormControl>
                            <Button
                                type="button"
                                onClick={handleAddTag}
                            >
                                Add Tag
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    className="flex items-center space-x-1 px-3 py-1"
                                >
                                    <span>#{tag}</span>
                                    <X
                                        className="cursor-pointer ml-2 hover:text-red-500"
                                        size={16}
                                        onClick={() => handleRemoveTag(tag)}
                                    />
                                </Badge>
                            ))}
                        </div>
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    );
};