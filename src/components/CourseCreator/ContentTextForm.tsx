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
    const fontSize = form.watch(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontSize`);
    const fontWeight = form.watch(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontWeight`);
    const italics = form.watch(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.italics`);
    const emphasis = form.watch(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.emphasis`);

    const fontSizeClasses = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg"
    };

    const fontWeightClasses = {
        normal: "font-normal",
        bold: "font-bold"
    };

    const baseButtonClass = "p-2 border rounded flex items-center gap-1 transition-all duration-200 hover:bg-gray-100";

    const activeButtonClass = "bg-blue-100 border-blue-300 text-blue-600";

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

    const toggleBold = () => {
        const newFontWeight = fontWeight === "bold" ? "normal" : "bold";
        form.setValue(
            `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontWeight`,
            newFontWeight
        );
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
                                <div className="flex border rounded">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            form.setValue(
                                                `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontSize`,
                                                decreaseFontSize(fontSize)
                                            )
                                        }}
                                        className={`${baseButtonClass} rounded-r-none ${fontSize === 'small' ? activeButtonClass : ''}`}
                                        title="Decrease Font Size"
                                    >
                                        <Type className="h-4 w-4"/>
                                        <MoveDown className="h-4 w-4"/>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => form.setValue(
                                            `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontSize`,
                                            increaseFontSize(fontSize)
                                        )}
                                        className={`${baseButtonClass} rounded-l-none border-l ${fontSize === 'large' ? activeButtonClass : ''}`}
                                        title="Increase Font Size"
                                    >
                                        <Type className="h-4 w-4"/>
                                        <MoveUp className="h-4 w-4"/>
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={toggleBold}
                                    className={`${baseButtonClass} ${fontWeight === 'bold' ? activeButtonClass : ''}`}
                                    title="Toggle Bold"
                                >
                                    <Bold className="h-4 w-4"/>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => form.setValue(
                                        `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.italics`,
                                        !italics
                                    )}
                                    className={`${baseButtonClass} ${italics ? activeButtonClass : ''}`}
                                    title="Toggle Italics"
                                >
                                    <Italic className="h-4 w-4"/>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => form.setValue(
                                        `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.emphasis`,
                                        !emphasis
                                    )}
                                    className={`${baseButtonClass} ${emphasis ? activeButtonClass : ''}`}
                                    title="Toggle Emphasis"
                                >
                                    <Baseline className="h-4 w-4"/>
                                </button>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex-1">
                                    <Textarea
                                        {...field}
                                        placeholder="Text Content"
                                        className={`w-full ${fontSizeClasses[fontSize]} ${fontWeightClasses[fontWeight]} 
                                            ${italics ? "italic" : ""} ${emphasis ? "underline" : ""}`}
                                    />
                                </div>
                                <DeleteButton onClick={() => removeContent(contentIndex)}/>
                            </div>
                        </div>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
};