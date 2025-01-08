import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
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
import ColorPicker from "@/components/CourseCreator/ColorPicker";
import {FC} from "react";

interface ContentTextFormProps {
    form: UseFormReturn<CourseForm>;
    chapterIndex: number;
    subChapterIndex: number;
    contentIndex: number;
    removeContent: (index: number) => void;
}

export const ContentTextForm: FC<ContentTextFormProps> = ({
                                                                    form,
                                                                    chapterIndex,
                                                                    subChapterIndex,
                                                                    contentIndex,
                                                                    removeContent
                                                                }) => {
    const fontSize = form.watch(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.fontSize`);
    const bolder = form.watch(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.bolder`);
    const italics = form.watch(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.italics`);
    const underline = form.watch(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.underline`);
    const textColor = form.watch(`chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.textColor`);

    const fontSizeClasses = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg"
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
                                    onClick={() => form.setValue(
                                        `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.bolder`,
                                        !bolder
                                    )}
                                    className={`${baseButtonClass} ${bolder ? activeButtonClass : ''}`}
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
                                        `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.underline`,
                                        !underline
                                    )}
                                    className={`${baseButtonClass} ${underline ? activeButtonClass : ''}`}
                                    title="Toggle Emphasis"
                                >
                                    <Baseline className="h-4 w-4"/>
                                </button>
                                <ColorPicker
                                    value={textColor}
                                    onChange={(color) => {
                                        form.setValue(
                                            `chapters.${chapterIndex}.subchapters.${subChapterIndex}.content.${contentIndex}.textColor`,
                                            color
                                        );
                                    }}
                                />
                            </div>

                            <div className="flex justify-between">
                                <div className="flex-1">
                                    <Textarea
                                        {...field}
                                        placeholder="Text Content"
                                        className={`w-full ${fontSizeClasses[fontSize]} ${bolder ? "font-bold" : "font-normal"} 
                                            ${italics ? "italic" : ""} ${underline ? "underline" : ""}`}
                                        style={{ color: textColor }}
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