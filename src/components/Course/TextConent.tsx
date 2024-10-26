import {cText} from "@/models/CourseData";

export const TextContent = ({ content }: { content: cText }) => (
    <p className={`whitespace-pre-wrap
            ${content.fontSize === 'small' ? 'text-sm' : content.fontSize === 'medium' ? 'text-base' : 'text-lg'}
            ${content.bolder ? 'font-bold' : 'font-normal'}
            ${content.italics ? 'italic' : ''}
            ${content.underline ? 'underline' : ''}
        `}>
        {content.text}
    </p>
);