import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import React from "react";
import {UseFormReturn} from "react-hook-form";
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";
import {CourseForm} from "@/components/CourseCreator/formSchema";

import {
    Type,
    Bold,
    Italic,
    Baseline,
    MoveUp,
    MoveDown
} from "lucide-react";

interface ContentTextFormProps {
    form: UseFormReturn<CourseForm>;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
    removeContent: (index: number) => void;
}

export const ContentTextForm: React.FC<ContentTextFormProps> = ({
                                                                    form,
                                                                    chapterIndex,
                                                                    subChapterIndex,
                                                                    contentIndex,
                                                                    removeContent
                                                                }) => {

    const increaseFontSize = (currentSize: "small" | "medium" | "large") => {
        if (currentSize === "small") return "medium";
        if (currentSize === "medium") return "large";
        return "large";
    };

    const decreaseFontSize = (currentSize: "small" | "medium" | "large") => {
        if (currentSize === "large") return "medium";
        if (currentSize === "medium") return "small";
        return "small";
    };

    const increaseBoldness = (currentBold: "normal" | "bold" | "bolder") => {
        if (currentBold === "normal") return "bold";
        if (currentBold === "bold") return "bolder";
        return "bolder";
    };

    const decreaseBoldness = (currentBold: "normal" | "bold" | "bolder") => {
        if (currentBold === "bolder") return "bold";
        if (currentBold === "bold") return "normal";
        return "normal";
    };

    return (
        <FormField
            control={form.control}
            name={`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.text`}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <div>
                            <div className="flex space-x-2 mb-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        form.setValue(
                                            `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontSize`,
                                            decreaseFontSize(form.getValues(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontSize`))
                                        )
                                    }}
                                    className="p-2 border rounded flex"
                                    title="Decrease Font Size"
                                >
                                    <Type/>-
                                    <MoveDown/>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => form.setValue(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontSize`,
                                        increaseFontSize(form.getValues(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontSize`))
                                    )}
                                    className="p-2 border rounded flex"
                                    title="Increase Font Size"
                                >
                                    <Type/>
                                    <MoveUp/>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => form.setValue(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontWeight`,
                                        decreaseBoldness(form.getValues(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontWeight`))
                                    )}
                                    className="p-2 border rounded flex"
                                    title="Decrease Font Size"
                                >
                                    <Bold/>
                                    <MoveDown/>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => form.setValue(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontWeight`,
                                        increaseBoldness(form.getValues(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontWeight`))
                                    )}
                                    className="p-2 border rounded flex"
                                    title="Increase Font Size"
                                >
                                    <Bold/>
                                    <MoveUp/>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => form.setValue(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.italics`,
                                        !form.getValues(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.italics`))
                                    }
                                    className={`p-2 border rounded ${form.getValues(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.italics`)
                                        ? "bg-gray-300" : ""}`}
                                    title="Toggle Italics"
                                >
                                    <Italic/>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => form.setValue(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.emphasis`,
                                        !form.getValues(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.emphasis`))
                                    }
                                    className={`p-2 border rounded ${form.getValues(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.emphasis`)
                                        ? "bg-gray-300" : ""}`}
                                    title="Toggle Emphasis"
                                >
                                    <Baseline/>
                                </button>
                            </div>
                            <div className="flex justify-between">
                                <Textarea
                                    {...field}
                                    placeholder="Text Content"
                                    onChange={(e) => {
                                        field.onChange(e);
                                    }}
                                />
                                <DeleteButton onClick={() => removeContent(contentIndex)}/>
                            </div>
                        </div>

                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
}