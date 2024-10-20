import {cText} from "@/models/CourseData";

export const TextContent = ({ content }: { content: cText }) => (
    <p className={`
            ${content.fontSize === 'small' ? 'text-sm' : content.fontSize === 'medium' ? 'text-base' : 'text-lg'}
            ${content.fontWeight === 'normal' ? 'font-normal' : content.fontWeight === "bold" ? "font-bold" : 'font-black'}
            ${content.italics ? 'italic' : ''}
            ${content.emphasis ? 'text-blue-600' : ''}
        `}>
        {content.text}
    </p>
);