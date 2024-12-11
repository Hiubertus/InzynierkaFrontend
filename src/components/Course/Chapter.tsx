import { FC } from "react";

interface ChapterProps {
    order: number;
    name: string;

}

export const Chapter: FC<ChapterProps> = ({ order, name }) => (
    <div className="flex flex-col w-full">
        <div className="flex justify-between items-center w-full">
            <span>{`${order}. ${name}`}</span>
        </div>

    </div>
);