import {cText} from "@/models/CourseData";

export const TextContent = ({ content }: { content: cText }) => (
    <p className={`
            ${content.fontSize === 'small' ? 'text-sm' : content.fontSize === 'medium' ? 'text-base' : 'text-lg'}
            ${content.fontWeight === 'normal' ? 'font-normal' : 'font-bold'}
            ${content.italics ? 'italic' : ''}
            ${content.emphasis ? 'text-blue-600' : ''}
        `}>
        {content.text}
    </p>
);